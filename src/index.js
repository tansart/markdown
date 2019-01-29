import React, {memo} from 'react';
import parser from './parser';

export default memo(function Markdown({cacheid, data, ...props}) {
  return <div {...props} dangerouslySetInnerHTML={{__html: parser(data, cacheid)}}></div>;
});
