"use strict";
/*
 * @Author: Yang Lin
 * @Description: 配置markdownit，使用container加载自定义代码块
 * @Date: 2020-07-12 10:33:37
 * @LastEditTime: 2020-07-25 15:20:18
 * @FilePath: f:\sourcecode\md-vue-loader\src\config.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const markdown_it_container_1 = __importDefault(require("markdown-it-container"));
function default_1(md, { containerName = 'demo', demoWrapperClass = 'vue-demo-block', descClass = 'vue-demo-desc', highlightClass = 'vue-demo-highlight', beforeDemoSlotName = 'beforeVueDemoBlock', afterDemoSlotName = 'afterVueDemoBlock', beforeDescSlotName = 'beforeDescDemoBlock', afterDescSlotName = 'afterDescDemoBlock', beforeCodeSlotName = 'beforeCodeDemoBlock', afterCodeSlotName = 'afterCodeDemoBlock' }, getName) {
    const containerReg = new RegExp(`^${containerName}\\s+(.*)$`, 'i');
    md.use(markdown_it_container_1.default, containerName, {
        validate: (params) => {
            return containerReg.test(params.trim());
        },
        render: (tokens, idx) => {
            // 开标签
            if (tokens[idx].nesting === 1) {
                // 当前md文件中唯一组件名
                const componentName = getName();
                // 替换:::demo中vue代码为组件
                return `<div class="${demoWrapperClass}">
                    <slot name="${beforeDemoSlotName}"></slot>
                    <${componentName}></${componentName}>
                    <slot name="${afterDemoSlotName}"></slot>
                `;
            }
            else {
                // 闭标签
                return `</div>\n`;
            }
        }
    });
    md.use(markdown_it_container_1.default, 'tip');
    md.use(markdown_it_container_1.default, 'warning');
    // 默认代码高亮处理
    const defaultFence = md.renderer.rules.fence || function (tokens, idx) {
        const token = tokens[idx];
        return `<pre v-pre ><code class="language-${token.info}">${md.utils.escapeHtml(token.content)}</code></pre>`;
    };
    // 插入对等的高亮代码块
    md.renderer.rules.fence = function (tokens, idx, options, env, self) {
        const token = tokens[idx];
        const prevToken = tokens[idx - 1];
        // 处理当前代码是vue组件的代码块
        const isInDemoContainer = prevToken && prevToken.nesting === 1 && prevToken.info.trim().match(/^demo\s*(.*)$/);
        if (isInDemoContainer) {
            const description = isInDemoContainer[1].trim();
            return `
                ${description ? `<div class="${descClass}">
                    <slot name="${beforeDescSlotName}"></slot>
                    ${md.render(description)}
                    <slot name="${afterDescSlotName}"></slot>
                </div>` : ''}\n
                <div class="${highlightClass}">
                    <slot name="${beforeCodeSlotName}"></slot>
                    <pre><code class="html" v-pre >${md.utils.escapeHtml(token.content)}</code></pre>
                    <slot name="${afterCodeSlotName}"></slot>
                </div>\n
            `;
        }
        return defaultFence(tokens, idx, options, env, self);
    };
}
exports.default = default_1;
;
//# sourceMappingURL=config.js.map