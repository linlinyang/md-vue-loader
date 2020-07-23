"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: Yang Lin
 * @Description: loader 入口
 * @Date: 2020-07-18 10:42:53
 * @LastEditTime: 2020-07-23 22:23:42
 * @FilePath: f:\sourcecode\md-vue-loader\src\index.ts
 */
const markdown_it_1 = __importDefault(require("markdown-it"));
const loader_utils_1 = __importDefault(require("loader-utils"));
const colors_1 = __importDefault(require("./colors"));
const config_1 = __importDefault(require("./config"));
const write_1 = __importDefault(require("write"));
const path_1 = __importDefault(require("path"));
const convert = function (source) {
    if (source instanceof Buffer) {
        return source;
    }
    const loaderContext = this;
    const { resourcePath, resourceQuery } = loaderContext;
    // 解析请求字符串
    const queryParams = resourceQuery.length > 0
        ? loader_utils_1.default.parseQuery(resourceQuery)
        : {};
    // 请求md文件中vue代码块
    if (queryParams.fence) {
        // 请求md文件中的第n个vue代码块，从0开始
        const index = typeof queryParams.componentIndex === 'string'
            ? Number(queryParams.componentIndex)
            : 0;
        // 从md文件中匹配特殊标记的vue代码
        const matches = source.match(/:::demo[\s\S]*?:::/ig);
        if (!matches || !matches[index]) {
            console.log(`${colors_1.default.warn('[md-vue-loader]')}: 请求${resourcePath}中的第${index}个${colors_1.default.error(':::demo')}标记块失败。`);
            return '';
        }
        const vueBlocks = matches[index].match(/```([\s\S]*?)(<[\s\S]*)```/i);
        if (vueBlocks && vueBlocks[2]) {
            return vueBlocks[2];
        }
        console.log(`${colors_1.default.warn('[md-vue-loader]')}: 请求${resourcePath}中的第${index}个${colors_1.default.error(':::demo')}标记块中的vue代码块失败。`);
        return '';
    }
    // 初始化markdownit
    const md = new markdown_it_1.default({
        html: true
    });
    // 设置markdown自定义代码块
    let counter = 0;
    let comps = [];
    config_1.default(md, function (params) {
        return function () {
            params.push(`component${counter++}`);
            return `component${counter++}`;
        };
    }(comps));
    console.log(comps);
    // markdown将md文件转换为预期代码
    const code = md.render(source);
    // vue组件标记开标签
    const startTag = '<!-- <vue-component-block>';
    // vue组件标记闭标签
    const endTag = '</vue-component-block> --!>';
    // 下一次检索起始位置
    let start = 0;
    // vue组件标记开标签位置
    let tagBeginIndex = code.indexOf(startTag, start);
    //  vue组件标记闭标签位置
    let tagEndIndex = code.indexOf(endTag, tagBeginIndex + startTag.length);
    // 最终输出html内容
    let templateContent = '';
    // vue 组件名标志
    let componentIndex = 0;
    // script 引入vue组件
    let srciptImport = '';
    // components 属性
    let components = [];
    while (tagBeginIndex >= 0 && tagEndIndex >= 0) {
        templateContent += code.slice(start, tagBeginIndex);
        // 编译vue组件字符串
        const componentName = `component${componentIndex}`;
        const request = `${resourcePath}?fence&componentIndex=${componentIndex++}`;
        srciptImport += `import ${componentName} from ${loader_utils_1.default.stringifyRequest(loaderContext, request)};`;
        templateContent += `<${componentName}></${componentName}>`;
        components.push(`${componentName}: ${componentName}`);
        start = tagEndIndex + endTag.length;
        tagBeginIndex = code.indexOf(startTag, start);
        tagEndIndex = code.indexOf(endTag, tagBeginIndex + startTag.length);
    }
    if (start > 0) {
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
    write_1.default(path_1.default.resolve(__dirname, 'aaa.vue'), ret);
    return `module.exports = ${ret}`;
};
exports.default = convert;
//# sourceMappingURL=index.js.map