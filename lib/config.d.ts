import MarkdownIt = require('markdown-it');
interface Option {
    containerName?: string;
    componentWrapperClass?: string;
    descClass?: string;
    highlightClass?: string;
}
declare const _default: (md: MarkdownIt, { containerName, componentWrapperClass, descClass, highlightClass }?: Option) => void;
export = _default;
