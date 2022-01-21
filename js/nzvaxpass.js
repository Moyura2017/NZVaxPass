// export const decoder = qrCode => {
export function decoder (qrCode) {
  if (qrCode.length == 0) throw new Error('Error#1: Empty payload');
  let payload = qrCode.split('/');

  if (payload[0] != 'NZCP:') throw new Error('Error#2: Invalid payload prefix');
  if (payload[1] != 1) throw new Error('Error#3: Invalid payload version');
  payload = payload[2];
  payload = payload.replace(/=/g, '') //Step 4 remove padding

  //Conver base32 to binary
  let BASE32_TO_DEC = {
    'A':  0, 'B':  1, 'C':  2, 'D':  3, 'E':  4, 'F':  5, 'G':  6, 'H':  7,
    'I':  8, 'J':  9, 'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15,
    'Q': 16, 'R': 17, 'S': 18, 'T': 19, 'U': 20, 'V': 21, 'W': 22, 'X': 23,
    'Y': 24, 'Z': 25, '2': 26, '3': 27, '4': 28, '5': 29, '6': 30, '7': 31
  };

  let i = 0, chr, bin, bStr = '';
  for (i; i < payload.length;) {
    chr = payload.charAt(i++);  //Step 8 get a char from base32 payload
    chr = BASE32_TO_DEC[chr];   //Step 7 convert base32 to decimal
    bin = chr.toString(2);      //Step 5 convert decimal to binary
    bin = '0000' + bin;         //Step 6 convert to a 5bits group
    bin = bin.substring(bin.length - 5);
    bStr += bin
  }

  const majorType = ['+Num', '-Num', 'bStr', 'Text', 'Array', 'Map', 'Tag', 'Float'];

  const row = {
    Index: 0,
    start: 0,
    end: 0,
    Index2: 0,
    hex: '',
    mt: '',
    bin: '',
    len: 0,
    content: ''
  }

  let getConntent = () => {
    row.bin = bStr.substring(row.start, row.end);
    row.hex = parseInt(row.bin, 2).toString(16);
    row.content = binaryConverter(row.bin, 'ascii');
    return row
  }

  const binaryConverter = (val, type) => {
    //bin=bin.map ( function (x)  { return x } );
    //bin=bin.map (          (x)=>{ return x } );
    //bin=bin.map (           x =>         x   );
    val = val.replace(/\d{8}/g, '$&x'); //create a group of 8 digits
    val = val.split('x'); //Convert them to array
    val.pop(); //remove empty value in the last element
    if (type == 'ascii') {
      val = val.map(x => String.fromCharCode(parseInt(x, 2))).join('');  //Convert bin > Dec > Ascii > Joint Chars
    } else if (type == 'hex') {
      val = val.map(x => parseInt(x, 2).toString(16)).join('');
    }
    return val
  }

  const cwt = {
    Header: { kid: "", alg: "" },
    Payload: {
      iss: "",
      nbf: 0,
      exp: 0,
      jti: "urn:uuid:",
      vc: {
        context: [,],
        version: "",
        type: [,],
        credentialSubject: { givenName: '', familyName: '', dob: '' }
      }
    },
    signature: { bstr: '' }
  }

  let getHeader = () => {
    // clearRow();
    row.bin = bStr.substring(row.start, row.end);
    row.hex = parseInt(row.bin, 2).toString(16);
    row.mt = majorType[parseInt(row.bin.substring(0, 3), 2)] + ' ' + parseInt(row.bin.substring(0, 3), 2);
    row.len = parseInt(row.bin.substring(3, row.bin.length), 2);
    row.content = binaryConverter(row.bin, 'ascii');
    row.Index = row.start / 8;
    row.Index2 = row.end / 8;
    return row
  }
  row.start = 0; row.end = row.start + 8; getHeader(); if (row.hex != 'd2') throw new Error('Error#4: Invalid tag #');
  row.start = 32; row.end = row.start + 8; getHeader(); if (row.len !== 4) throw new Error('Error#5: field name should be kid'); //The claim key of 4 is used to identify kid
  row.start = row.end; row.end = row.start + 8; getHeader(); row.start = row.end; row.end = row.start + (8 * row.len); getHeader(); cwt.Header.kid = row.content; if (row.content != cwt.Header.kid) throw new Error('Error#6: Invalid kid value');
  row.start = row.end; row.end = row.start + 8; getHeader(); if (row.len !== 1) throw new Error('Error#7: field name should be alg'); //The claim key of 1 is used to identify alg
  row.start = row.end; row.end = row.start + 8; getHeader(); if (row.len !== 6) throw new Error('Error#8: Invalid alg value'); cwt.Header.alg = row.len+'(-7,ES256)';//value:6=-7 Name:ES256, Hash: SHA-256, Description: ECDSA w/ SHA-256 https://datatracker.ietf.org/doc/draft-ietf-cose-rfc8152bis-algs/12/
  row.start = 8 * 20; row.end = row.start + 8; getHeader(); row.start = row.end; row.end = row.start + (8 * row.len); getHeader(); cwt.Payload.iss = row.content;//if (row.content != cwt.Payload.iss) throw new Error('Error#9: Invalid issuer');
  row.start = 8 * 52; row.end = row.start + 8; getHeader(); row.start = row.end; row.end = row.start + (8 * 4); getHeader(); row.content = parseInt(row.bin, 2); let myDate = new Date(parseInt(row.content * 1000)); cwt.Payload.nbf = myDate.toLocaleDateString(); //Date/Time .toLocaleString();
  row.start = 8 * 59; row.end = row.start + 8 * 4; getHeader(); row.content = parseInt(row.bin, 2); myDate = new Date(parseInt(row.content * 1000)); cwt.Payload.exp = myDate.toLocaleDateString(); //Date/Time .toLocaleString();
  row.start = 8 * 78; row.end = row.start + 8; getHeader(); row.len = parseInt(row.bin, 2); row.start = row.end; row.end += (row.len * 8); getHeader();  cwt.Payload.vc.context[0] = row.content; //if (row.content != cwt.Payload.vc.context[0]) throw new Error('Error#10: Invalid context value');
  row.start = 8 * 118; row.end = row.start + 8; getHeader(); row.len = parseInt(row.bin, 2); row.start = row.end; row.end += (row.len * 8); getHeader(); cwt.Payload.vc.context[1] = row.content; //if (row.content != cwt.Payload.vc.context[1]) throw new Error('Error#11: Invalid context value');
  row.start = 8 * 161; row.end = row.start + 8; getHeader(); row.start = row.end; row.end += (row.len * 8); getHeader(); if (row.content != 'version') throw new Error('Error#12: Field name should be version');
  row.start = row.end; row.end = row.start + 8; getHeader(); row.start = row.end; row.end += (row.len * 8); getHeader(); cwt.Payload.version = row.content;
  //TYPE row.start = 8*176; row.end = row.start + 8; getHeader(); row.start=row.end; row.end += (row.len * 8); getHeader();
  row.start = 8 * 181; row.end = row.start + 8; getHeader(); row.start = row.end; row.end += (row.len * 8); getHeader(); cwt.Payload.vc.type[0] = row.content;
  row.start = row.end; row.end = row.start + 8; getHeader(); row.start = row.end; row.end += (row.len * 8); getHeader(); cwt.Payload.vc.type[1] = row.content;
  row.start = row.end; row.end = row.start + 8; getHeader(); row.start = row.end; row.end += (row.len * 8); getHeader();
  //GIVENAME  row.start = 8*237; row.end = row.start + 8; getHeader(); row.start=row.end; row.end += (row.len * 8); getHeader();
  row.start = 8 * 247; row.end = row.start + 8; getHeader(); row.start = row.end; row.end += (row.len * 8); getHeader(); cwt.Payload.vc.credentialSubject.givenName = row.content;
  row.start = 8 * 263; row.end = row.start + 8; getHeader(); row.start = row.end; row.end += (row.len * 8); getHeader(); cwt.Payload.vc.credentialSubject.familyName = row.content;
  //DOB row.start = 8*271; row.end = row.start + 8; getHeader(); row.start=row.end; row.end += (row.len * 8); getHeader();
  row.start = 8 * 275; row.end = row.start + 8; getHeader(); row.start = row.end; row.end += (row.len * 8); getHeader(); cwt.Payload.vc.credentialSubject.dob = row.content;
  //7
  row.start = 8 * 286; row.end = row.start + 8; getHeader();
  //uri
  row.start = row.end; row.end = row.start + 8; getHeader();
  row.start = row.end;
  row.end += (row.len * 8); getHeader();
  row.content = binaryConverter(row.bin, 'hex');
  row.content = row.content.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/g, '$1-$2-$3-$4-$5');
  cwt.Payload.jti += row.content;
  //  jti: "urn:uuid:60a4f54d-4e30-4332-be33-ad78b1eafa4b"
  //  4-2-2-2-6
  //  4       -2   -2   -2   -6   hex octet pattern
  //  8        4    4    4    12
  //  60a4f54d-4e30-4332-be33-ad78b1eafa4b  =128bits, 16byte, 32hex

  //  Encoded signature

  function html(obj) {
    var tbl = '<table>';
    for (var fName in obj) {
      var ele = obj[fName];
      var value = (typeof (ele) === 'object') ? html(ele) : ele.toString();
      tbl += '<tr><td>' + fName + '</td><td>' + value + '</tr>';
    }
    tbl += '</table>';
    return tbl;
  }

  console.clear();
  // payload = `${payload}<br><br>${bStr}<br>${row}`;
  // console.table(row);
  console.table(cwt);
  return html(cwt);
}