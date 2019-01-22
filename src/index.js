import React from 'react';
import parser from './parser';

export default function Markdown({data, ...props}) {
	return <div {...props} dangerouslySetInnerHTML={{__html: parser(data)}}></div>;
}
