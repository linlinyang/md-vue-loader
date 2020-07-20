/*
 * @Author: Yang Lin
 * @Description: 简介
 * @Date: 2020-07-09 20:34:35
 * @LastEditTime: 2020-07-20 20:54:31
 * @FilePath: f:\sourcecode\md-vue-loader\src\index.ts
 */ 
import MarkdownIt = require('markdown-it');
import loaderUtils = require('loader-utils');
import config = require('./config');
import parseVue = require('./parseVue');
import path = require('path');
import write = require('write');
const md = new MarkdownIt({
    html: true
});

export = function loader(source: string): string{
    const options = loaderUtils.getOptions(this);
    config(md);
    const code = md.render(source);
    
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
    let componentIndex: number = 1;
    // script 引入vue组件
    let srciptImport: string = '';
    // components 属性
    let components: string[] = [];

    while (tagBeginIndex >= 0 && tagEndIndex >= 0) {
        templateContent += code.slice(start, tagBeginIndex);
        // 编译vue组件字符串
        const vueCode = code.slice(tagBeginIndex + startTag.length, tagEndIndex);
        const {
            dir,
            name
        } = path.parse(this.resourcePath);
        const componentName: string = md.utils.escapeHtml(`${name}${componentIndex}`);
        const fileName = path.join(dir,`${name}`,`${name}${componentIndex++}.vue`);
        write.sync(fileName, vueCode);
        srciptImport += `import ${componentName} from '${JSON.stringify(fileName)}';`;
        templateContent += `<${componentName}></${componentName}>
        `;
        components.push(`${componentName}: Function('(${componentName})')()`);
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

    return ret;
}