/*
 * @Author: Yang Lin
 * @Description: loader options
 * @Date: 2020-07-24 21:15:59
 * @LastEditTime: 2020-07-31 20:37:49
 * @FilePath: f:\sourcecode\md-vue-loader\src\options.ts
 */ 

/**
 * markdone-vue-loader convert sample
 * 
 * srouce code：
 * 
 * some markdown content...
 * :::${containerName: demo} some code descriptions
 *  ``` vue
 *      vue demo code
 *  ```
 * :::
 * some markdown content...
 * 
 * ===> convert result
 * 
 * <template>
 *  <div class="${templateClass}">
 *      some markdown content ...
 *      <div class="${demoWrapperClass}">
 *           <slot name="${beforeDemoSlotName}"></slot>
 *               vue demo code render result
 *           <slot name="${afterDemoSlotName}"></slot>
 *      </div>
 *      
 *      <div class="${descClass}">
 *           <slot name="${beforeDescSlotName}"></slot>
 *               some code descriptions
 *          <slot name="${afterDescSlotName}"></slot>
 *      </div>
 *      
 *      <div class="${highlightClass}">
 *           <slot name="${beforeCodeSlotName}"></slot>
 *           <prev><code class="html" v-pre >
 *               source vue demo code
 *           </code></prev>
 *           <slot name="${afterCodeSlotName}"></slot>
 *      </div>
 *      some markdown content ...
 *  </div>
 * </template>
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
 * markdone-vue-loader options
 */
interface Options {
    /**
     * As a mark of `vue demo code` 
     * @default "demo"
     */
    readonly containerName?: string;
    /**
     * the div className wrapped all markdown file
     */
    readonly templateClass?: string;
    /**
     * the div className wrapped `vue demo code` render result
     */
    readonly demoWrapperClass?: string;
    /**
     * the div className wrapped the `vue demo code` descriptions
     */
    readonly descWrapperClass?: string;
    /**
     * the div className wrapped the `vue demo code` source code
     */
    readonly highlightClass?: string;
    /**
     * the slot's name before `vue demo code` render result
     */
    readonly beforeDemoSlotName?: string,
    /**
     * the slot's name after `vue demo code` render result
     */
    readonly afterDemoSlotName?: string,
    /**
     * the slot's name before `vue demo code` descriptions
     */
    readonly beforeDescSlotName?: string,
    /**
     * the slot's name after `vue demo code` descriptions
     * @default "afterDescDemoBlock"
     */
    readonly afterDescSlotName?: string,
    /**
     * the slot's name before `vue demo code` source code
     */
    readonly beforeCodeSlotName?: string,
    /**
     * the slot's name after `vue demo code` source code
     */
    readonly afterCodeSlotName?: string,
    /**
     * markdownit configuration：http://markdown-it.docschina.org/
     * @default 
     * {
     *  html: true,
        breaks: true,
        linkify: true
     * }
     */
    readonly markdownConfig?: MarkdownIt.Options;
    /**
     * custom markdownit plugins
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