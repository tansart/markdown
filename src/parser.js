import {getListType, parseList} from './listParser';

export default function parser(str, cacheId) {
  const output = [
    parseBlock,
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

function parseBlock(str) {
  const strArr = str.split('\n\n');
  const len = strArr.length;

  const parseChain = [parseList, parseHeader, parseImages, parseCode, parseParagraph];

  return strArr.reduce((acc, p, i) => {
    const suffix = i + 1 < len ? '\n' : '';

    const content = parseChain.reduce((acc, parser) => {
      if(!acc) return parser(p);
      return acc;
    }, null);

    return `${acc}${content}${suffix}`;
  }, '');
}

function parseParagraph(str) {
  return `<p>${str}</p>`;
}

function parseCode(str) {
  const pattern = /^```([\w]+)?/ig;
  const patternEnd = /```$/;

  let out = str.replace(pattern, (match, languageType) => {
    if(languageType) {
      return `<code class="language-${languageType}">`;
    }

    return `<code>`;
  });

  if(out === str) return null;

  return out.replace(patternEnd, _ => `</code>`);
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
