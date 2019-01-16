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

function makeLink(id) {
  if (id == '_lengthiness') return () => console.log(org[id]);
  return () => {
    if (!directLink()) window.location = this.document.URL + '?' + id;
    else {
      let title = document.getElementById('title');
      title.innerText = this.org[id].title;
      let entry = document.getElementById('entry');
      entry.innerText = this.org[id].content;
    }
  }
}

function addUnderscoreListeners() {
  var all = document.getElementsByTagName('*');
  for (let i = 0; i < all.length; i++){
    if (all[i].id && all[i].id[0] == '_'){
      all[i].addEventListener('click', makeLink(all[i].id));
    }
  }
}

function directLink() {
  let url = this.document.URL;
  let urlArray = url.split('?');
  if (urlArray.length && urlArray.length > 1) {
    let id = urlArray[1];
    if (this.org[id]) return makeLink(id);
  }
  return false;
}

document.body.style.cursor = 'default';

fetch('files/info.org')
  .then(response => response.text())
  .then(response => {
    let org = response;
    this.org = readOrg(org);
    if (directLink()) directLink()();
    addUnderscoreListeners();
  });
