import MarkdownIt from 'markdown-it';
interface UniqComponentName {
    (): string;
}
interface Options {
    containerName?: string;
    demoWrapperClass?: string;
    descClass?: string;
    highlightClass?: string;
    beforeDemoSlotName?: string;
    afterDemoSlotName?: string;
    beforeDescSlotName?: string;
    afterDescSlotName?: string;
    beforeCodeSlotName?: string;
    afterCodeSlotName?: string;
}
export default function (md: MarkdownIt, { containerName, demoWrapperClass, descClass, highlightClass, beforeDemoSlotName, afterDemoSlotName, beforeDescSlotName, afterDescSlotName, beforeCodeSlotName, afterCodeSlotName }: Options, getName: UniqComponentName): void;
export {};
