/*
 * @Author: Yang Lin
 * @Description: loader 入口
 * @Date: 2020-07-18 10:42:53
 * @LastEditTime: 2020-07-29 19:28:51
 * @FilePath: f:\sourcecode\md-vue-loader\src\index.ts
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

// demo中vue代码转换为唯一组件名前缀
const uniqComponentName: string = `Com${uniqid()}Demo`;

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

    // loader 参数
    const options: Options = loaderUtils.getOptions(loaderContext);
        
    // 请求md文件中vue代码块
    if (queryParams.fence) {
        // 请求md文件中的第n个vue代码块，从0开始
        const index: number = typeof queryParams.componentIndex === 'string'
            ? Number(queryParams.componentIndex)
            : 0;
        // 从md文件中匹配特殊标记的vue代码
        const demoReg: RegExp = new RegExp(`:::${options.containerName || 'demo'}[\\s\\S]*?:::`, 'ig');
        const matches: null | RegExpMatchArray = source.match(demoReg);
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
        html: true,
        breaks: true,
        linkify: true,
        ...options.markdownConfig
    });
    
    // 组件名计数
    let componentIndex: number = 0;
    // components 属性
    let components: string[] = [];
    // 生成script引入当前md文件对应的组件
    let srciptImport: string = '';

    // 设置markdown自定义代码块
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
        // 生成唯一组件名，防止与全局冲突
        const componentName: string = `${uniqComponentName}${componentIndex}`;
        // 生成新的请求参数请求当前md文件对应的vue代码
        const request: string = `${resourcePath}?fence&componentIndex=${componentIndex++}`;
        // 引入组件
        srciptImport += `import ${componentName} from ${loaderUtils.stringifyRequest(loaderContext, request)};`;
        // 局部注册组件
        components.push(`'${componentName}': ${componentName}`);
        return componentName;
    });

    // 装载markdown插件
    if(options.plugins && options.plugins.length > 0){
        let len = options.plugins.length;
        while(len--){
            const curPlugin = options.plugins[len];
            md.use(curPlugin.plugin, ...curPlugin.options);
        }
    }

    // markdown将md文件转换为html代码
    const code: string = md.render(source);

    const ret = `
        <template>
            <div class="demo">
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