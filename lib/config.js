"use strict";
/*
 * @Author: Yang Lin
 * @Description: 配置markdownit，使用container加载自定义代码块
 * @Date: 2020-07-12 10:33:37
 * @LastEditTime: 2020-07-31 20:57:49
 * @FilePath: f:\sourcecode\md-vue-loader\src\config.ts
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const markdown_it_container_1 = __importDefault(require("markdown-it-container"));
/**
 * if className exist, return contain className prop
 * or return ''
 * @param className
 */
const getEffectiveClass = className => {
    if (className && className.trim()) {
        return `class="${className}"`;
    }
    return '';
};
/**
 * if slot name exist, return contain slot prop
 * or return ''
 * @param slotName
 */
const getEffectiveSlot = slotName => {
    if (slotName && slotName.trim()) {
        return `<slot name="${slotName}"></slot>`;
    }
    return '';
};
function default_1(md, { containerName = 'demo', demoWrapperClass, descClass, highlightClass, beforeDemoSlotName, afterDemoSlotName, beforeDescSlotName, afterDescSlotName, beforeCodeSlotName, afterCodeSlotName }, getName) {
    const containerReg = new RegExp(`^${containerName}[\\s\\S]*?$`, 'i');
    md.use(markdown_it_container_1.default, containerName, {
        validate: (params) => {
            return containerReg.test(params.trim());
        },
        render: (tokens, idx) => {
            // open tag
            if (tokens[idx].nesting === 1) {
                // uniq component name
                const componentName = getName();
                // replace `vue demo code` to child component
                return `<div ${getEffectiveClass(demoWrapperClass)}>
                    ${getEffectiveSlot(beforeDemoSlotName)}
                    <${componentName}></${componentName}>
                    ${getEffectiveSlot(afterDemoSlotName)}
                `;
            }
            else {
                // close tag
                return `</div>\n`;
            }
        }
    });
    md.use(markdown_it_container_1.default, 'tip');
    md.use(markdown_it_container_1.default, 'warning');
    const defaultFence = md.renderer.rules.fence || function (tokens, idx) {
        const token = tokens[idx];
        return `
            <div>
                <pre v-pre ><code class="language-${token.info}">${md.utils.escapeHtml(token.content)}</code></pre>
            </div>
        `;
    };
    // insert the `vue demo code` source code
    md.renderer.rules.fence = function (tokens, idx, options, env, self) {
        const token = tokens[idx];
        const prevToken = tokens[idx - 1];
        // is `vue demo code` or not
        const isInDemoContainer = prevToken && prevToken.nesting === 1 && prevToken.info.trim().match(/^demo\s*(.*)$/);
        if (isInDemoContainer) {
            // `vue demo code` descriptions
            const description = isInDemoContainer[1].trim();
            return `
                ${description ? `<div ${getEffectiveClass(descClass)}>
                    ${getEffectiveSlot(beforeDescSlotName)}
                    ${md.render(description)}
                    ${getEffectiveSlot(afterDescSlotName)}
                </div>` : ''}\n
                <div ${getEffectiveClass(highlightClass)}>
                    ${getEffectiveSlot(beforeCodeSlotName)}
                    <pre><code class="html" v-pre >${md.utils.escapeHtml(token.content)}</code></pre>
                    ${getEffectiveSlot(afterCodeSlotName)}
                </div>\n
            `;
        }
        return defaultFence(tokens, idx, options, env, self);
    };
}
exports.default = default_1;
;
//# sourceMappingURL=config.js.map