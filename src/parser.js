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

  // code blocks are allowed to have paragraphs within.
  let isCodeBlock = false;

  const parseChain = [parseCodeStart, parseList, parseHeader, parseImages, parseParagraph];

  return strArr.reduce((acc, p, i) => {
    const suffix = i + 1 < len ? '\n' : '';

    if(isCodeBlock) {
      const content = parseCodeEnd(p);
      isCodeBlock = !content; // is content is truthy, the code block ends there.
      return `${acc}\n${content ? content: p}${suffix}`;
    }

    const content = parseChain.reduce((acc, parser) => {
      if(!acc) {
        const parsed = parser(p);

        if(parsed && parser === parseCodeStart) {
          const parsedAndClosed = parseCodeEnd(parsed);

          if(!parsedAndClosed) {
            isCodeBlock = true;
            return parsed;
          }

          return parsedAndClosed;
        }

        return parsed;
      }
      return acc;
    }, null);
    return `${acc}${content}${suffix}`;
  }, '');
}

function parseParagraph(str) {
  return `<p>${str}</p>`;
}

function parseCodeStart(str) {
  let isCodeBlock = false;
  const pattern = /^```([\w]+)?/ig;

  const out = str.replace(pattern, (match, languageType) => {
    isCodeBlock = true;

    if(languageType) {
      return `<code class="language-${languageType}">`;
    }

    return `<code>`;
  });

  if(!isCodeBlock) return null;

  return out;
}

function parseCodeEnd(str) {
  let isCodeBlock = false;
  const patternEnd = /```$/;

  const out = str.replace(patternEnd, _ => {
    isCodeBlock = true;
    return `</code>`;
  });

  if(!isCodeBlock) return null;

  return out;
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

  return str.replace(pattern, function(match, label, link) {
    return `<a href="${link}">${label}</a>`;
  });
}

function sessionKey(key) {
  return `markdown.parser.${key}`;
}
