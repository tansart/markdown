export function parseList(str) {
  const listType = getListType(str);

  if (!listType) return null;

  const list = [];
  const output = [];
  const indentTrack = {};
  const strArr = str.split('\n');

  let lastIndentation = null;

  for (let i = 0; i < strArr.length; i++) {
    const type = getListType(strArr[i]);

    if (!type) {
      output.push(`<p>${strArr[i]}</p>`);
      continue;
    }

    if (!lastIndentation) {
      list.push(type.ordered ? 'ol' : 'ul');
      lastIndentation = list;
      indentTrack[type.indent] = list;
    } else if (!indentTrack[type.indent]) {
      indentTrack[type.indent] = [type.ordered ? 'ol' : 'ul'];
      lastIndentation.push(indentTrack[type.indent]);
    }

    indentTrack[type.indent].push(type);
    lastIndentation = indentTrack[type.indent];
  }

  output.push(closeNodes(list).join('\n'));

  return output.join('\n');
}

export function getListType(str) {
  const pattern = /^([\t\s]*)(?:([\d]+\.)|([*-]))[\s][\S]/igm;
  const type = pattern.exec(str);

  if (!type) {
    return false;
  }

  const indentation = type[1].length;

  if (type[2]) {
    return ListType(type[2], indentation, str.substr(indentation + type[2].length + 1), true);
  }

  return ListType(type[3], indentation, str.substr(indentation + type[3].length + 1), false);
}

function closeNodes(list, indent = 0) {
  let output = [`${pad(indent * 2)}<${list[0]}>`];

  for (let i = 1; i < list.length; i++) {
    if (Array.isArray(list[i])) {
      output.push(`${pad(indent * 2 + 2)}<li>`);
      output = output.concat(closeNodes(list[i], indent + 2));
      output.push(`${pad(indent * 2 + 2)}</li>`);
    } else {
      output.push(`${pad(indent * 2 + 2)}<li>${list[i].text}</li>`);
    }
  }

  return output.concat(`${pad(indent * 2)}</${list[0]}>`);
}

function pad(n) {
  return "".padStart(n);
}

function ListType(match, indent, text, ordered) {
  return {
    match,
    indent,
    text,
    ordered
  }
}
