/*
 * @Author: Yang Lin
 * @Description: loader 入口
 * @Date: 2020-07-18 10:42:53
 * @LastEditTime: 2020-10-16 09:57:27
 * @FilePath: d:\snake\md-vue-loader\src\index.ts
 */ 
import MarkdownIt from 'markdown-it';
import loaderUtils from 'loader-utils';
import {
    loader
} from 'webpack';
import colors from './colors';
import config from './config';
import uniqid from 'uniqid';
import Options from './options';

// The uniqu name of child component for `vue demo code`
const uniqComponentName: string = `Com${uniqid()}Demo`;

// loader query params
type QueryOptions = Partial<loaderUtils.OptionObject> | {
    fence: boolean | null | string;
    componentIndex: boolean | null | string | number;
}

const convert: loader.Loader = function(source) {
    if(source instanceof Buffer){
        return source;
    }

    const loaderContext: loader.LoaderContext = this;
    const {
        resourcePath,
        resourceQuery
    } = loaderContext;
    // parse query params
    const queryParams: QueryOptions = resourceQuery.length > 0
        ? loaderUtils.parseQuery(resourceQuery)
        : {
            fence: false,
            componentIndex: null
        };

    // loader options
    const options: Options = loaderUtils.getOptions(loaderContext);
        
    // has fence mark
    // strip the `vue demo code` directly
    if (queryParams.fence) {
        // the nth of component
        const index: number = typeof queryParams.componentIndex === 'string'
            ? isNaN(Number(queryParams.componentIndex))
                ? 0
                : Number(queryParams.componentIndex)
            : 0;
        // match the `vue demo code`
        const demoReg: RegExp = new RegExp(`:::${options.containerName || 'demo'}[\\s\\S]*?:::`, 'ig');
        const matches: null | RegExpMatchArray = source.match(demoReg);
        if (!matches || !matches[index]) {
            console.log(`${colors.warn('[markdone-vue-loader]')}: resolve ${index}th ${colors.error(':::demo')} in ${resourcePath} failed`);
            return '';
        }

        // weed out description code
        // get the real single file component format file
        const vueBlocks: null | RegExpMatchArray = matches[index].match(/```([\s\S]*?)(<[\s\S]*)```/i);
        if (vueBlocks && vueBlocks[2]) {
            return vueBlocks[2];
        }

        console.log(`${colors.warn('[markdone-vue-loader]')}: resolve ${index}th ${colors.error(':::demo')} markded vue code failed in ${resourcePath}.`);
        return '';
    }
    
    // 初始化markdownit
    const md: MarkdownIt = new MarkdownIt({
        html: true,
        breaks: true,
        linkify: true,
        ...options.markdownConfig
    });
    
    // component name counter
    let componentIndex: number = 0;
    // components props in this markdown-vue file
    let components: string[] = [];
    // the final script appended
    let srciptImport: string = '';

    // config markdown custom code
    config(md, {
        containerName: options.containerName,
        demoWrapperClass: options.demoWrapperClass,
        descClass: options.descWrapperClass,
        highlightClass: options.highlightClass,
        beforeDemoSlotName: options.beforeDemoSlotName,
        afterDemoSlotName: options.afterDemoSlotName,
        beforeDescSlotName: options.beforeDescSlotName,
        afterDescSlotName: options.afterDescSlotName,
        beforeCodeSlotName: options.beforeCodeSlotName,
        afterCodeSlotName: options.afterCodeSlotName
    }, function(){
        // gen uniq component Name
        const componentName: string = `${uniqComponentName}${componentIndex}`;
        // gen query params
        const request: string = `${resourcePath}?fence&componentIndex=${componentIndex++}`;
        // import component
        srciptImport += `import ${componentName} from ${loaderUtils.stringifyRequest(loaderContext, request)};`;
        // regist child component
        components.push(`'${componentName}': ${componentName}`);
        return componentName;
    });

    // install markdown plugins if exist
    if(options.plugins && options.plugins.length > 0){
        let len = options.plugins.length;
        while(len--){
            const curPlugin = options.plugins[len];
            md.use(curPlugin.plugin, ...curPlugin.options);
        }
    }

    // markdownit convert md fiele to html file
    const code: string = md.render(source);

    // the div className wrapped all md file
    const templateClass: string = options.templateClass 
        ? `class="${options.templateClass}"`
        : '';

    // the final return
    const ret: string = `
        <template>
            <div ${templateClass}>
                ${code}
            </div>
        </template>

        <script>
            ${srciptImport}
            export default {
                name: 'ComponentDoc',
                components: {
                    ${components.join(',')}
                }
            };
        </script>
    `;

    return `module.exports = ${ret}`;
};

export default convert;