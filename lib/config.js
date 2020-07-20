"use strict";
/*
 * @Author: Yang Lin
 * @Description: 使用container加载自定义代码块
 * @Date: 2020-07-12 10:33:37
 * @LastEditTime: 2020-07-16 19:40:23
 * @FilePath: \md-vue-loader\src\config.ts
 */
const container = require("markdown-it-container");
module.exports = function (md, { containerName = 'demo', componentWrapperClass = 'vue-demo-block', descClass = 'code-desc', highlightClass = 'highlight' } = {}) {
    const containerReg = new RegExp(`^${containerName}\\s+(.*)$`, 'i');
    md.use(container, containerName, {
        validate: (params) => {
            return containerReg.test(params.trim());
        },
        render: (tokens, idx) => {
            // 开标签
            if (tokens[idx].nesting === 1) {
                // 包含在特殊标志中的vue组件代码
                const nextToken = tokens[idx + 1];
                const content = nextToken.type === 'fence' ? nextToken.content.trim() : '';
                // 特殊标签包裹vue组件代码
                return `<div class="${componentWrapperClass}">
                    <!-- <vue-component-block>${content}</vue-component-block> --!>
                `;
            }
            else {
                // 闭标签
                return `</div>\n`;
            }
        }
    });
    // 默认代码高亮处理
    const defaultFence = md.renderer.rules.fence || function (tokens, idx) {
        const token = tokens[idx];
        return `<pre><code class="language-${token.info}">${md.utils.escapeHtml(token.content)}</code></pre>`;
    };
    // 插入对等的高亮代码块
    md.renderer.rules.fence = function (tokens, idx, options, env, self) {
        const token = tokens[idx];
        const prevToken = tokens[idx - 1];
        // 处理当前代码是vue组件的代码块
        const isInDemoContainer = prevToken && prevToken.nesting === 1 && prevToken.info.trim().match(/^demo\s*(.*)$/);
        if (isInDemoContainer) {
            const description = (prevToken.info || '').trim();
            return `
                ${description ? `<div class="${descClass}">${md.render(description)}</div>` : ''}\n
                <div class="${highlightClass}">
                    <pre><code class="html">${md.utils.escapeHtml(token.content)}</code></pre>
                </div>\n
            `;
        }
        return defaultFence(tokens, idx, options, env, self);
    };
};
//# sourceMappingURL=config.js.map