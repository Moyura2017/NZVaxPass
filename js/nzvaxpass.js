export const decoder = qrCode => {
  // qrCode=''; throw 500;

  if (qrCode.length == 0) throw new Error('Empty payload');
  let payload = qrCode.split('/');
  //console.log('var: ' + (payload[1]) );

  if (payload[0] != 'NZCP:') throw new Error('Invalid payload prefix');
  if (payload[1] != 1) throw new Error('Invalid payload version');
  payload = payload[2];
  payload = payload.replace(/=/g, '') //remove padding

  //Conver base32 to binary
  let BASE32_TO_DEC = {
    'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7,
    'I': 8, 'J': 9, 'K': 10, 'L': 11, 'M': 12, 'N': 13, 'O': 14, 'P': 15,
    'Q': 16, 'R': 17, 'S': 18, 'T': 19, 'U': 20, 'V': 21, 'W': 22, 'X': 23,
    'Y': 24, 'Z': 25, '2': 26, '3': 27, '4': 28, '5': 29, '6': 30, '7': 31
  };

  let i = 0, index = 0, chr, bin, bStr = '';
  for (i; i < payload.length;) {
    chr = payload.charAt(i++);  //get a char from base32 payload
    chr = BASE32_TO_DEC[chr];   //convert base32 to decimal
    bin = chr.toString(2);//st5      
    bin = '0000' + bin;
    bin = bin.substring(bin.length - 5); //st4  //while (toBinary.length % 5 !== 0) toBinary = '0' + toBinary; //console.log('val: '+ val);
    bStr += bin //st2
  }
  console.log('       Decoded Base32 > Dcimal > Binary(5)');
  console.log(bStr + ' len(' + (bStr.length) + ') Decoded base32');

  payload = `${payload}<br><br>${bStr}`;




/*
  const crypto = require('cryto') //built-in
  const base64Url = require('base64-url)

  const secret = 'kD42uirOCRrMgethHfn8KoiKAw7Nd94T';  //256-bit
  const secret = process.env.SECRET;
  const content = `${header}.${payload}`;
  
  Signature = f(header, payload, secret, algorithm)
  const signature = base64url.escape(
    crypto.createHmac('sha256',secret
          .update(content)
          .digest('base64')
  ) //=>SflKxwR...

  const payload = {
    sub: '123',
    name: 'abc',
    admin: 'false'
  }
  const jwt = require('jsonwebtoken')//https://jwt.io/
  const token = `${header}.${payload}.${signature}`
  const token = jwt.sign(payload,secret,{algorithm:'HS256'})

  const body = document.body;
  const div = document.createElement('div');
  body.innerHTML = 'from js';
  body.append(div);
*/
  console.log('js: ' + payload);
  return payload;
}