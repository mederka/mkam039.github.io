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

function underscoreClick(arg){
  return () => console.log(arg);
}

function addUnderscoreListeners(){
  var all = document.getElementsByTagName('*');
  for (let i = 0; i < all.length; i++){
    if (all[i].id && all[i].id[0] == '_'){
      all[i].addEventListener('click', underscoreClick(all[i].id));
    }
  }
}

fetch('http://kamalov.net/files/info.org')
  .then(response => response.text())
  .then(response => {
    let org = response;
    org = readOrg(org);
    addUnderscoreListeners();
  });
