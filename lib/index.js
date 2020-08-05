"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * @Author: Yang Lin
 * @Description: loader 入口
 * @Date: 2020-07-18 10:42:53
 * @LastEditTime: 2020-08-05 19:30:38
 * @FilePath: f:\sourcecode\md-vue-loader\src\index.ts
 */
const markdown_it_1 = __importDefault(require("markdown-it"));
const loader_utils_1 = __importDefault(require("loader-utils"));
const colors_1 = __importDefault(require("./colors"));
const config_1 = __importDefault(require("./config"));
const uniqid_1 = __importDefault(require("uniqid"));
// The uniqu name of child component for `vue demo code`
const uniqComponentName = `Com${uniqid_1.default()}Demo`;
const convert = function (source) {
    if (source instanceof Buffer) {
        return source;
    }
    const loaderContext = this;
    const { resourcePath, resourceQuery } = loaderContext;
    // parse query params
    const queryParams = resourceQuery.length > 0
        ? loader_utils_1.default.parseQuery(resourceQuery)
        : {
            fence: false,
            componentIndex: null
        };
    // loader options
    const options = loader_utils_1.default.getOptions(loaderContext);
    // has fence mark
    // strip the `vue demo code` directly
    if (queryParams.fence) {
        // the nth of component
        const index = typeof queryParams.componentIndex === 'string'
            ? isNaN(Number(queryParams.componentIndex))
                ? 0
                : Number(queryParams.componentIndex)
            : 0;
        // match the `vue demo code`
        const demoReg = new RegExp(`:::${options.containerName || 'demo'}[\\s\\S]*?:::`, 'ig');
        const matches = source.match(demoReg);
        if (!matches || !matches[index]) {
            console.log(`${colors_1.default.warn('[markdone-vue-loader]')}: resolve ${index}th ${colors_1.default.error(':::demo')} in ${resourcePath} failed`);
            return '';
        }
        // weed out description code
        // get the real single file component format file
        const vueBlocks = matches[index].match(/```([\s\S]*?)(<[\s\S]*)```/i);
        if (vueBlocks && vueBlocks[2]) {
            return vueBlocks[2];
        }
        console.log(`${colors_1.default.warn('[markdone-vue-loader]')}: resolve ${index}th ${colors_1.default.error(':::demo')} markded vue code failed in ${resourcePath}.`);
        return '';
    }
    // 初始化markdownit
    const md = new markdown_it_1.default(Object.assign({ html: true, breaks: true, linkify: true }, options.markdownConfig));
    // component name counter
    let componentIndex = 0;
    // components props in this markdown-vue file
    let components = [];
    // the final script appended
    let srciptImport = '';
    // config markdown custom code
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
        // gen uniq component Name
        const componentName = `${uniqComponentName}${componentIndex}`;
        // gen query params
        const request = `${resourcePath}?fence&componentIndex=${componentIndex++}`;
        // import component
        srciptImport += `import ${componentName} from ${loader_utils_1.default.stringifyRequest(loaderContext, request)};`;
        // regist child component
        components.push(`'${componentName}': ${componentName}`);
        return componentName;
    });
    // install markdown plugins if exist
    if (options.plugins && options.plugins.length > 0) {
        let len = options.plugins.length;
        while (len--) {
            const curPlugin = options.plugins[len];
            md.use(curPlugin.plugin, ...curPlugin.options);
        }
    }
    // markdownit convert md fiele to html file
    const code = md.render(source);
    // the div className wrapped all md file
    const templateClass = options.templateClass
        ? `class="${options.templateClass}"`
        : '';
    // the final return
    const ret = `
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
exports.default = convert;
//# sourceMappingURL=index.js.map