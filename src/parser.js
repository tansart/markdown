import {getListType, parseList} from './listParser';

export default function parser(str) {
	return [
		parseParagraph,
		parseBold,
		parseItalic,
		parseAnchors
	].reduce((acc, fn) => fn(acc), str);
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
				content = `<p>${p}</p>`;
			}
		}

		return `${acc}${content}${suffix}`;
	}, '');
}

function parseHeader(str) {
	const pattern = /^([#]+)[\s](.+)/igm;

	if(str.search(pattern) < 0) {
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
