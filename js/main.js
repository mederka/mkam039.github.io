function readOrg(org, level=1){
  let orgArray = org.split('\n' + '*'.repeat(level) + ' ');  
  let output = {};
  for (let i = 1; i < orgArray.length; i++){
    let item = orgArray[i].split('\n');
    const id = item.shift();
    const joinedItem = '\n' + item.join('\n');
    const splitter = '\n' + '*'.repeat(level+1) + ' ';
    if (org.indexOf(splitter) == -1) output[id] = item.join('\n');
    else output[id] = readOrg(joinedItem, level + 1);
  }
  return output;
}

function underscoreClick(id, org){
  if (id == '_lengthiness') return () => console.log(org[id]);
  return () => {
    let title = document.getElementById('title');
    title.innerText = org[id].title;
    let entry = document.getElementById('entry');
    entry.innerText = org[id].content;
  }
}

function addUnderscoreListeners(org){
  var all = document.getElementsByTagName('*');
  for (let i = 0; i < all.length; i++){
    if (all[i].id && all[i].id[0] == '_'){
      all[i].addEventListener('click', underscoreClick(all[i].id, org));
    }
  }
}

document.body.style.cursor = 'default';

fetch('files/info.org')
  .then(response => response.text())
  .then(response => {
    let org = response;
    org = readOrg(org);
    addUnderscoreListeners(org);
  });
