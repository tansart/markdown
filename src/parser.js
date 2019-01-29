import {getListType, parseList} from './listParser';

export default function parser(str, cacheId) {
  const output = [
    parseParagraph,
    parseBold,
    parseItalic,
    parseAnchors
  ].reduce((acc, fn) => fn(acc), str);

  if (cacheId && typeof sessionStorage !== 'undefined') {
    const cached = sessionStorage.getItem(sessionKey(cacheId));

    if (cached) {
      return cached;
    }

    sessionStorage.setItem(sessionKey(cacheId), output)
  }

  return output;
}

function parseParagraph(str) {
  const strArr = str.split('\n\n');
  const len = strArr.length;

  return strArr.reduce((acc, p, i) => {
    const suffix = i + 1 < len ? '\n' : '';
    const listType = getListType(p);

    let content;

    if (listType) {
      content = parseList(p);
    } else {
      content = parseHeader(p);

      if (!content) {
        content = parseImages(p);
      }

      if (!content) {
        content = `<p>${p}</p>`;
      }
    }

    return `${acc}${content}${suffix}`;
  }, '');
}

function parseHeader(str) {
  const pattern = /^([#]+)[\s](.+)/igm;

  if (str.search(pattern) < 0) {
    return null;
  }

  return str.replace(pattern, (match, header, title) => {
    return `<h${header.length}>${title}</h${header.length}>`;
  });
}

function parseBold(str) {
  const pattern = /\*\*([\S].+?[\S])\*\*/ig;

  return str.replace(pattern, (match, group) => {
    return `<strong>${group}</strong>`;
  });
}

function parseItalic(str) {
  const pattern = /\*([^\s\*].+?[^\s\*])\*/ig;

  return str.replace(pattern, (match, group) => {
    return `<i>${group}</i>`;
  });
}

function parseImages(str) {
  const pattern = /!\[([^\]]+)\]\(([^\)]+)\)/ig;
  const patternResult = pattern.exec(str);

  if (!patternResult) {
    return null;
  }

  const {index} = patternResult;
  const [match, label, src] = patternResult;

  const prefix = str.substr(0, index);
  const suffix = str.substr(index + match.length);

  return `<div class="image-wrapper">${prefix}<img src="${src}" alt="${label}" />${suffix}</div>`;
}

function parseAnchors(str) {
  const pattern = /\[([^\]]+)\]\(([^\)]+)\)/ig;
  const patternResult = pattern.exec(str);

  if (!patternResult) {
    return str;
  }

  const {index} = patternResult;
  const [match, label, link] = patternResult;

  const prefix = str.substr(0, index);
  const suffix = str.substr(index + match.length);

  return `${prefix}<a href="${link}">${label}</a>${suffix}`;
}

function sessionKey(key) {
  return `markdown.parser.${key}`;
}
