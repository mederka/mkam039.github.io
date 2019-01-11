function readOrg(org, level=1){
  let orgArray = org.split('\n' + '*'.repeat(level) + ' ');
  let output = {};
  for (let i = 1; i < orgArray.length; i++){
    let item = orgArray[i].split('\n');
    const id = item.shift();
    output[id] = item.join('\n');
  }
  return output;
}

function underscoreClick(id, org){
  return () => console.log(org[id]);
}

function addUnderscoreListeners(org){
  var all = document.getElementsByTagName('*');
  for (let i = 0; i < all.length; i++){
    if (all[i].id && all[i].id[0] == '_'){
      all[i].addEventListener('click', underscoreClick(all[i].id, org));
    }
  }
}

fetch('files/info.org')
  .then(response => response.text())
  .then(response => {
    let org = response;
    org = readOrg(org);
    addUnderscoreListeners(org);
  });
