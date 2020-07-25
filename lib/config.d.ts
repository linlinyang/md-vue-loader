import MarkdownIt from 'markdown-it';
interface UniqComponentName {
    (): string;
}
export default function (md: MarkdownIt, { containerName, demoWrapperClass, descClass, highlightClass, beforeDemoSlotName, afterDemoSlotName, beforeDescSlotName, afterDescSlotName, beforeCodeSlotName, afterCodeSlotName }: {
    containerName?: string | undefined;
    demoWrapperClass?: string | undefined;
    descClass?: string | undefined;
    highlightClass?: string | undefined;
    beforeDemoSlotName?: string | undefined;
    afterDemoSlotName?: string | undefined;
    beforeDescSlotName?: string | undefined;
    afterDescSlotName?: string | undefined;
    beforeCodeSlotName?: string | undefined;
    afterCodeSlotName?: string | undefined;
}, getName: UniqComponentName): void;
export {};
