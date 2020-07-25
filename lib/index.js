"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: Yang Lin
 * @Description: loader 入口
 * @Date: 2020-07-18 10:42:53
 * @LastEditTime: 2020-07-25 16:24:37
 * @FilePath: f:\sourcecode\md-vue-loader\src\index.ts
 */
const markdown_it_1 = __importDefault(require("markdown-it"));
const loader_utils_1 = __importDefault(require("loader-utils"));
const colors_1 = __importDefault(require("./colors"));
const config_1 = __importDefault(require("./config"));
const uniqid_1 = __importDefault(require("uniqid"));
// demo中vue代码转换为唯一组件名前缀
const uniqComponentName = `Com${uniqid_1.default()}Demo`;
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
    const options = loader_utils_1.default.getOptions(loaderContext);
    // 初始化markdownit
    const md = new markdown_it_1.default(Object.assign({ html: true, breaks: true, linkify: true }, options.markdownConfig));
    // 组件名计数
    let componentIndex = 0;
    // components 属性
    let components = [];
    // 生成script引入当前md文件对应的组件
    let srciptImport = '';
    // 设置markdown自定义代码块
    config_1.default(md, {
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
    }, function () {
        // 生成唯一组件名，防止与全局冲突
        const componentName = `${uniqComponentName}${componentIndex}`;
        // 生成新的请求参数请求当前md文件对应的vue代码
        const request = `${resourcePath}?fence&componentIndex=${componentIndex++}`;
        // 引入组件
        srciptImport += `import ${componentName} from ${loader_utils_1.default.stringifyRequest(loaderContext, request)};`;
        // 局部注册组件
        components.push(`'${componentName}': ${componentName}`);
        return componentName;
    });
    // 装载markdown插件
    if (options.plugins && options.plugins.length > 0) {
        let len = options.plugins.length;
        while (len--) {
            const curPlugin = options.plugins[len];
            md.use(curPlugin.plugin, ...curPlugin.options);
        }
    }
    // markdown将md文件转换为html代码
    const code = md.render(source);
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
exports.default = convert;
//# sourceMappingURL=index.js.map