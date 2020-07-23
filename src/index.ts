/*
 * @Author: Yang Lin
 * @Description: loader 入口
 * @Date: 2020-07-18 10:42:53
 * @LastEditTime: 2020-07-23 22:27:45
 * @FilePath: f:\sourcecode\md-vue-loader\src\index.ts
 */ 
import MarkdownIt from 'markdown-it';
import loaderUtils from 'loader-utils';
import {
    loader
} from 'webpack';
import colors from './colors';
import config from './config';
import write from 'write';
import path from 'path';
import { Console } from 'console';

const convert: loader.Loader = function(source) {
    if(source instanceof Buffer){
        return source;
    }

    const loaderContext: loader.LoaderContext = this;
    const {
        resourcePath,
        resourceQuery
    } = loaderContext;
    // 解析请求字符串
    const queryParams = resourceQuery.length > 0
        ? loaderUtils.parseQuery(resourceQuery)
        : {};

    // 请求md文件中vue代码块
    if (queryParams.fence) {
        // 请求md文件中的第n个vue代码块，从0开始
        const index: number = typeof queryParams.componentIndex === 'string'
            ? Number(queryParams.componentIndex)
            : 0;
        // 从md文件中匹配特殊标记的vue代码
        const matches: null | RegExpMatchArray = source.match(/:::demo[\s\S]*?:::/ig);
        if (!matches || !matches[index]) {
            console.log(`${colors.warn('[md-vue-loader]')}: 请求${resourcePath}中的第${index}个${colors.error(':::demo')}标记块失败。`);
            return '';
        }

        const vueBlocks: null | RegExpMatchArray = matches[index].match(/```([\s\S]*?)(<[\s\S]*)```/i);
        if (vueBlocks && vueBlocks[2]) {
            return vueBlocks[2];
        }

        console.log(`${colors.warn('[md-vue-loader]')}: 请求${resourcePath}中的第${index}个${colors.error(':::demo')}标记块中的vue代码块失败。`);
        return '';
    }

    // 初始化markdownit
    const md: MarkdownIt = new MarkdownIt({
        html: true
    });
    // 设置markdown自定义代码块
    config(md);

    // markdown将md文件转换为预期代码
    const code: string = md.render(source);
    
    // vue组件标记开标签
    const startTag: string = '<!-- <vue-component-block>';
    // vue组件标记闭标签
    const endTag: string = '</vue-component-block> --!>';
    // 下一次检索起始位置
    let start: number = 0;
    // vue组件标记开标签位置
    let tagBeginIndex:number = code.indexOf(startTag, start);
    //  vue组件标记闭标签位置
    let tagEndIndex:number = code.indexOf(endTag, tagBeginIndex + startTag.length);
    // 最终输出html内容
    let templateContent: string = '';
    // vue 组件名标志
    let componentIndex: number = 0;
    // script 引入vue组件
    let srciptImport: string = '';
    // components 属性
    let components: string[] = [];

    while (tagBeginIndex >= 0 && tagEndIndex >= 0) {
        templateContent += code.slice(start, tagBeginIndex);
        // 编译vue组件字符串
        const componentName: string =`component${componentIndex}`;
        const request: string = `${resourcePath}?fence&componentIndex=${componentIndex++}`;
        srciptImport += `import ${componentName} from ${loaderUtils.stringifyRequest(loaderContext, request)};`;
        templateContent += `<${componentName}></${componentName}>`;
        components.push(`${componentName}: ${componentName}`);
        start = tagEndIndex + endTag.length;
        tagBeginIndex = code.indexOf(startTag, start);
        tagEndIndex = code.indexOf(endTag, tagBeginIndex + startTag.length);
    }

    if(start > 0){
        templateContent += code.slice(start);
    }

    const ret = `
        <template>
            <div class="demo">
                ${templateContent}
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

    write(path.resolve(__dirname, 'aaa.vue'), ret);
    return `module.exports = ${ret}`;
};

export default convert;