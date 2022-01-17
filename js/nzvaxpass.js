export const decoder = qrCode => {
  // qrCode='';
  // throw 500
  
  if (qrCode.length == 0) throw new Error('Empty payload');
  var payload = qrCode.split('/');
  //console.log('var: ' + (payload[1]) );

  if (payload[0] != 'NZCP:') throw new Error('Invalid payload prefix');
  if(payload[1] != 1) throw new Error('Invalid payload version');
  payload=payload[2];
  
  
  // const body = document.body;
  //const div = document.createElement('div');
  // body.innerHTML = 'from js';
  //body.append(div);


  return payload;
}