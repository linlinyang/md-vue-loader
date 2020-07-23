import MarkdownIt from 'markdown-it';
interface Option {
    containerName?: string;
    componentWrapperClass?: string;
    descClass?: string;
    highlightClass?: string;
}
interface getName {
    (): string;
}
export default function (md: MarkdownIt, callback: getName, { containerName, componentWrapperClass, descClass, highlightClass }?: Option): void;
export {};
