(function(global, rawText) {

  function parseTree(raw, level=1) {
    let rawArray = raw.split('\n' + '*'.repeat(level) + ' ');
    let output = {};
    if (rawArray[0][0] != '*') output.text = rawArray.shift();
    if (rawArray) {
      for (let branch of rawArray) {
        let contents = branch.split('\n');
        let id = contents.shift();
        if (id[0] == '*') id = id.split('* ')[1];
        output[id] = parseTree(contents.join('\n'), level + 1);
      }
    }
    return output;
  };

  function parseLink(text) {
    let textArray = text.split('[[');
    if (textArray.length > 1) {
      for (let i = 1; i < textArray.length; i++) {
        let chunks = textArray[i].split('][');
        let nextChunks = chunks[1].split(']]');
        textArray[i] = '<a href="?' + chunks[0] + '">' + nextChunk[0] + '</a> ' + nextChunk[1];
      }
    }
    return textArray.join('');
  };

  function isImage(str) {
    const formats = ['jpg', 'jpeg', 'png',
                     'gif', 'apng', 'svg',
                     'bmp', 'ico'];
    let output = false;
    formats.forEach(format => {
      let regex = new RegExp(format + ' *$', 'i');
      if (regex.test(str)) output = true;
    });
    return output;
  }

  function parseInserts(text) {
    let textArray = text.split('{');
    if (textArray.length > 1) {
      for (let i = 1; i < textArray.length; i++) {
        let chunks = textArray[i].split('}');
        if (isImage(chunks[0])) textArray[i] = '<img src="'+ chunks[0] + '">' + chunks[1];
        else textArray[i] = chunks[1];
      }
    }
    return textArray.join('');
  }

  function renderText(text) {
    let out = parseLink(text);
    out = parseInserts(out);
    return out.replace(/\n/gi, '<br>');
  };
  
  function renderPage(id, path=null) {
    let branch;
    if (path) {
      branch = t2.data;
      while (path.length) {
        branch = branch[path.shift()];
      }
    }
    
    else branch = t2.data[id];
    return () => {
      let title = document.getElementById('title');
      title.innerText = branch.title.text;
      let content = document.getElementById('content');
      content.innerHTML = renderText(branch.content.text);
    }
  };
  
  function addInternalLinks() {
    let all = document.getElementsByClassName('text-link');
    for (let i = 0; i < all.length; i++){
      if (all[i].id){
        all[i].addEventListener('click', renderPage(all[i].id));
      }
    }
  };

  function directLink() {
    let url = this.document.URL;
    let urlArray = url.split('?');
    if (urlArray.length && urlArray.length > 1) {
      urlArray.shift();
      return renderPage(null, urlArray);
    }
    return false;
  };

  
  let Text2Page = function(path) {
    return new Text2Page.init(path);
  };

  Text2Page.prototype = {
   
  };

  fetch(rawText)
    .then(response => response.text())
    .then(response => {
      let raw = response;
      Text2Page.data = parseTree(raw);
      addInternalLinks();
      if (directLink()) directLink()();
    });

  Text2Page.init = function(path) {
    
  };

  Text2Page.init.prototype = Text2Page.prototype;

  global.Text2Page = global.t2 = Text2Page;
    
}(window, 't2.org'));
