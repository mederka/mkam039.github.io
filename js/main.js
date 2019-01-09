function readOrg(org){
  let orgArray = org.split('\n* ');
  let output = {};
  for (let i = 1; i < orgArray.length; i++){
    let item = orgArray[i].split('\n');
    output[i] = {};
    output[i].title = item.shift();
    output[i].content = item.join('\n');
  }
  return output;
}

fetch('https://kamalov.net/files/info.org')
  .then(response => response.text())
  .then(response => {
    let org = response;
    org = readOrg(org);
    console.log(org);
  });
