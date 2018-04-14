function emptyNode(idSelector) {
  const element = document.querySelector(idSelector);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * @param {String} HTML representing any number of sibling elements
 * @return {NodeList}
 */
function htmlToElements(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content.childNodes;
}


export default {
  emptyNode,
  htmlToElements,
};
