/*
 * @Author: Yang Lin
 * @Description: 配置markdownit，使用container加载自定义代码块
 * @Date: 2020-07-12 10:33:37
 * @LastEditTime: 2020-07-29 19:39:05
 * @FilePath: f:\sourcecode\md-vue-loader\src\config.ts
 */ 

import MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import Token = require('markdown-it/lib/token');
import Renderer = require('markdown-it/lib/renderer');

// 每次生成自定义代码时调用
// 生成当前md文件中唯一的组件名
interface UniqComponentName {
    (): string
}

export default function(
    md: MarkdownIt,
    {
        containerName = 'demo',
        demoWrapperClass = 'vue-demo-block',
        descClass = 'vue-demo-desc',
        highlightClass = 'vue-demo-highlight',
        beforeDemoSlotName = 'beforeVueDemoBlock',
        afterDemoSlotName = 'afterVueDemoBlock',
        beforeDescSlotName = 'beforeDescDemoBlock',
        afterDescSlotName = 'afterDescDemoBlock',
        beforeCodeSlotName = 'beforeCodeDemoBlock',
        afterCodeSlotName = 'afterCodeDemoBlock'
    },
    getName: UniqComponentName
): void {
    const containerReg: RegExp = new RegExp(`^${containerName}[\\s\\S]*?$`,'i');
    
    md.use(container, containerName, {
        validate: (params: string): boolean => {
            return containerReg.test(params.trim());
        },
        render: (tokens: any, idx: number): string => {
            // 开标签
            if (tokens[idx].nesting === 1) {
                // 当前md文件中唯一组件名
                const componentName: string = getName();
                // 替换:::demo中vue代码为组件
                return `<div class="${demoWrapperClass}">
                    <slot name="${beforeDemoSlotName}"></slot>
                    <${componentName}></${componentName}>
                    <slot name="${afterDemoSlotName}"></slot>
                `;
            }else{
                // 闭标签
                return `</div>\n`;
            }
        }
    });
    md.use(container, 'tip');
    md.use(container, 'warning');
    
    // 默认代码高亮处理
    const defaultFence: Renderer.RenderRule = md.renderer.rules.fence || function(
        tokens: Token[],
        idx: number
    ) {
        const token: Token = tokens[idx];
        return `<pre v-pre ><code class="language-${token.info}">${md.utils.escapeHtml(token.content)}</code></pre>`;
    };
    // 插入对等的高亮代码块
    md.renderer.rules.fence = function(tokens, idx, options, env, self): string {
        const token: Token= tokens[idx];
        const prevToken: Token = tokens[idx - 1];
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
};