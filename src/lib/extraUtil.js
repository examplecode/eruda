import beautify from 'js-beautify'
import evalCss from './evalCss'

export default function(util) {
  Object.assign(util, {
    beautify,
    evalCss,
    isErudaEl
  })
}

export function isErudaEl(el) {
  let parentNode = el.parentNode

  if (!parentNode) return false

  while (parentNode) {
    parentNode = parentNode.parentNode
    if (parentNode && parentNode.id === 'eruda') return true
  }

  return false
}

function getTop(e){
    var offset=e.offsetTop;
    if(e.offsetParent!=null) offset+=getTop(e.offsetParent);
    return offset;
}

/* 获取元素相对于浏览器的left */
function getLeft(e){
    var offset=e.offsetLeft;
    if(e.offsetParent!=null) offset+=getLeft(e.offsetParent);
    return offset;
}


export function genHideElementRule(el) {
    var rule = '';
    var id = el.id;
    var cl = '';
    var host =  window.location.host;
    var tagName = el.tagName;
    var attrs = el.getAttributeNames();
    var selector = '';
    var extra = '';

    var attrList = '';
    for(var i = 0; i < el.classList.length;i++) {
        cl +=  '.' +  el.classList.item(i);

    }

    for(var j = 0 ; j < attrs.length; j++) {
      var fuzzy = false;
      var hasVaule = true;
      var name = attrs[j];
      var value = el.getAttribute(name);
      if(name == 'class') {
        continue;
      }

      if(name == 'id') {
          continue;
      }

      if(!value) {
          hasVaule = false;
      }
      if(name.indexOf('src') >= 0 || name.indexOf('href') >= 0 || name.indexOf('source') >= 0) {
          var p = value.indexOf('?');
          if(p>0) {
            value = value.substring(0,p);
            fuzzy = true;
          }

      }
      if(!hasVaule) {
          attrList += '[' + name + ']';
      }
      else if(!fuzzy) {
          attrList += '[' + name + '=' + '\'' + value + '\'' + ']';
      } else {
          attrList += '[' + name + '^=' + '\'' + value + '\'' + ']';
      }

    }

    if(tagName) {
        selector += tagName;
    }
    if(id) {
      selector += '#' + id;
    }

    if(cl) {
      selector += cl;
    }

    if(attrList) {
      selector += attrList;
    }

    var elements = document.querySelectorAll(selector);
    if(elements.length > 1) {
       extra = '%' + getLeft(el)+ ':' + getTop(el) + ':' + el.offsetWidth + ':' + el.offsetHeight;
    }

    if(host) {
      rule = host + '##' + selector
    } else {
      rule = '##' + selector;
    }
    rule += extra;
    return rule;
}

