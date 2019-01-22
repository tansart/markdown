import React from 'react';
import parser from './parser';

export default function Markdown({data}) {
	return <div dangerouslySetInnerHTML={{__html: parser(data)}}></div>;
}
