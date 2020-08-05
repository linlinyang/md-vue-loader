# markdone-vue-loader

> 一款用于将markdown文件转换为`Vue`单文本组件的`webpack loader`。
>
> 如果markdown文件中的`vue组件`代码被`:::demo`和`:::`包裹，那么这个`vue组件`代码将会被直接渲染出来，并保留源代码。
>
> 编写vue组件库的时候，可将示例代码放在文档中，减少工作量和维护成本。

**注意：**由于`markdown-vue-loader`已被注册，所以使用`markdone-vue-loader`。

**注意：**本文中`Vue demo code`不做特别申明，即被`:::demo`和`:::`包裹的`vue`组件代码。

[English document](README.md)

## 使用

1、安装

```shell
npm install markdone-vue-loader vue-loader
```

2、配置`webpack`的`loader`

```js
// webpack.conf.js
module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader'
    },{
        test: /\.js$/,
        loader: 'babel-loader?cacheDirectory',
        exclude: /node_modules/
    },{
        test: /\.md$/,
        use: [{
            loader: 'vue-loader'
        },{
            loader: 'markdone-vue-loader',
            options: {
                ...
            }
        }]
    }]
}
```

3、然后你的markdown文件都被挡住Vue单文本组件来处理，`vue demo code`渲染时被当做子组件处理并且支持`vue-loader`所有功能。

4、[下载本loader](https://github.com/linlinyang/md-vue-loader)，然后运行`npm install && npm run dev`即可查看示例demo。



## 原理

> 一下内容将讲述此loader工作原理，感兴趣的可以阅读并帮助使用。

`markdown`文件第一次被此loader处理：

1. 使用[markdown-it](https://www.npmjs.com/package/markdown-it) 将`markdown`文件转换为`html`。
2. 使用[markdown-it-container](https://www.npmjs.com/package/markdown-it-container)将`vue demo code`标记为`<component0></component0>,<component1></component1>...`。
3. 配置`md.renderer.rules.fence`，保留`vue demo code`源代码，使用`vue`内置指令`v-pre`跳过编译。
4. 使用`template`包裹以上步骤处理的`html`标记，使之作为vue单文本组件的渲染模板。
5. 增加`script`来注册`vue demo code`为子组件:

```javascript
<script>
	import component0 from './this-markdown.md?fence&componentIndex=0';
    import component1 from './this-markdown.md?fence&componentIndex=1';
    export default {
        name: 'ComponentDoc',
        components: {
            component0: component0,
            component1: component1
        }
    };
</script>
```

这时，md文件已经被我们处理成vue单文本组件了，这里我们配置`vue-loader`作为下一个loader，在处理这个组件时，`import component0 from './this-markdown.md?fence&componentIndex=0';`会带有请求参数次再加载这个md文件。

`markdown`带参数第二次被此loader处理：

1. 解析请求参数，`fence`用来区分是否是第一次请求这个md文件， `componentIndex` 用来获取第几个`vue demo code`。
2. 使用正则获取实际的`vue demo code`并返回交还给`vue-loader`处理。

至此，处理流程已完成。

## 转换结果示例

参考转换结果示例，可以用于美化最终转换结果。

```js
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
```

注意：以上代码中被`${}`标记的变量都是可以在`loader`参数中设置，class和slot相关属性没有被设置将不被转换出对应的内容。



## loader参数

```typescript
/**
 * markdone-vue-loader 参数
 */
interface Options {
    /**
     * 用于标记 `vue demo code` 代码
     * @default "demo"
     */
    readonly containerName?: string;
    /**
     * 包裹markdown文件的转换结果的div的类名
     */
    readonly templateClass?: string;
    /**
     * 包裹`vue demo code` 渲染结果的div的类名
     */
    readonly demoWrapperClass?: string;
    /**
     * 包裹`vue demo code` 简介渲染结果的div的类名
     */
    readonly descWrapperClass?: string;
    /**
     * 包裹`vue demo code` 源码的div的类名
     */
    readonly highlightClass?: string;
    /**
     * `vue demo code` 前插槽名
     */
    readonly beforeDemoSlotName?: string;
    /**
     * `vue demo code` 后插槽名
     */
    readonly afterDemoSlotName?: string;
    /**
     * `vue demo code` 简介前插槽名
     */
    readonly beforeDescSlotName?: string;
    /**
     * `vue demo code` 简介后插槽名
     */
    readonly afterDescSlotName?: string;
    /**
     * `vue demo code` 源码前插槽名
     */
    readonly beforeCodeSlotName?: string;
    /**
     * `vue demo code` 源码后插槽名
     */
    readonly afterCodeSlotName?: string;
    /**
     * markdown 配置：http://markdown-it.docschina.org/
     * @default 
     * {
     *  html: true,
        breaks: true,
        linkify: true
     * }
     */
    readonly markdownConfig?: MarkdownIt.Options;
    /**
     * 自定义markdownit插件
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
```

