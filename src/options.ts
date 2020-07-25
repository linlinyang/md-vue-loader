/*
 * @Author: Yang Lin
 * @Description: 简介
 * @Date: 2020-07-24 21:15:59
 * @LastEditTime: 2020-07-25 17:40:53
 * @FilePath: f:\sourcecode\md-vue-loader\src\options.ts
 */ 

/**
 * markdone-vue-loader 转换示例
 * 
 * 原始代码：
 * :::${containerName: demo} 一些代码简介 
 *  ``` vue
 *      vue组件代码
 *  ```
 * :::
 * 
 * ===> 转换结果
 * 
 * <div class="${demoWrapperClass}">
 *      <slot name="${beforeDemoSlotName}"></slot>
 *          组件渲染结果
 *      <slot name="${afterDemoSlotName}"></slot>
 * </div>
 * 
 * <div class="${descClass}">
 *      <slot name="${beforeDescSlotName}"></slot>
 *          一些代码简介 
 *     <slot name="${afterDescSlotName}"></slot>
 * </div>
 * 
 * <div class="${highlightClass}">
 *      <slot name="${beforeCodeSlotName}"></slot>
 *      <prev><code class="html" v-pre >
 *          源代码
 *      </code></prev>
 *      <slot name="${afterCodeSlotName}"></slot>
 * </div>
 */

import MarkdownIt from 'markdown-it';

/**
 * 使用自定义markdownit插件
 */
interface MarkdownItPluginOptions {
    readonly plugin: MarkdownIt.PluginSimple | MarkdownIt.PluginWithOptions | MarkdownIt.PluginWithParams;
    readonly options: any[]
}

/**
 * markdone-vue-loader 参数
 */
interface Options {
    /**
     * md文档中包裹示例代码标记
     * @default "demo"
     */
    readonly containerName?: string;
    /**
     * vue组件运行包裹div类名
     * @default "vue-demo-block"
     */
    readonly demoWrapperClass?: string;
    /**
     * 标记代码块简介包裹div的类名
     * @default "vue-demo-desc"
     */
    readonly descWrapperClass?: string;
    /**
     * 标记代码块实际代码包裹div的类名
     * @default "vue-demo-highlight"
     */
    readonly highlightClass?: string;
    /**
     * 示例代码前插槽名
     * @default "beforeVueDemoBlock"
     */
    readonly beforeDemoSlotName?: string,
    /**
     * 示例代码后插槽名
     * @default "afterVueDemoBlock"
     */
    readonly afterDemoSlotName?: string,
    /**
     * 简介代码前插槽名
     * @default "beforeDescDemoBlock"
     */
    readonly beforeDescSlotName?: string,
    /**
     * 简介代码后插槽名
     * @default "afterDescDemoBlock"
     */
    readonly afterDescSlotName?: string,
    /**
     * 源代码前插槽名
     * @default "beforeCodeDemoBlock"
     */
    readonly beforeCodeSlotName?: string,
    /**
     * 源代码前插槽名
     * @default "afterCodeDemoBlock"
     */
    readonly afterCodeSlotName?: string,
    /**
     * markdownit配置信息，详情参考：http://markdown-it.docschina.org/
     * @default 
     * {
     *  html: true,
        breaks: true,
        linkify: true
     * }
     */
    readonly markdownConfig?: MarkdownIt.Options;
    /**
     * 配置自定义markdownit插件
     * @example 
     * [{
     *  plugin: require('markdown-it-anchor'),
     *  options: [{
     *      level: 2,
            slugify: slugify,
            permalink: true,
            permalinkBefore: true
     *  }]
     * }]
     * =>
     * md.use(plugin, ...options)
     * @default []
     */
    readonly plugins?: MarkdownItPluginOptions[]
}

export default Options;