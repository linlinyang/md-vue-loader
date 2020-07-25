# markdone-vue-loader

> 构建自己的组件库的时候，为了查看效果，我们需要编写一套demo来调试我们的代码
>
> 然后在编写文档的时候，我们又需要将demo中的代码修改后做示例代码，展示在文档中，而且展示代码还不能运行
>
> 本loader的作用就是将`markdown`文档中的`vue`代码提取运行，这样既可以预览代码结果用作调试和展示
>
> 同时我们还保留的文档中的`vue`源代码，用作展示
>
> `markdown`中其他部分内容通过`markdown-it`插件转换为`html`代码

**注意：** 这里的`markdone`名字是故意写错的，正确的名字已经被占用，主要还是用作于转换markdown文件



## 使用

示例代码可在仓库代码中下载并运行`npm install && npm run dev`查看效果

1、安装依赖

```
npm install markdone-vue-loader
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
                // 更多配置参考  src/options.ts
            }
        }]
    }]
}
```

3、编写`md`文件，注意`vue`代码块（必须是`markdown`标记代码块）必须被`:::demo`和`:::`包裹（“demo”可以在此loader配置参数中设置）。

~~~vue
// ButtonDemo.md
## Button 组件

一、`Button` 组件的基本使用

:::demo #### Button 组件基础用法:

``` vue

<template>
    <div class="demo">
        <Button>默认按钮</Button>
        <Button type="primary">主要按钮</Button>
        <Button type="success">主要按钮</Button>
    </div>
</template>

<script>
import Button from "./components/Button";

export default {
    name: 'ButtonDemo',
    components: {
        Button
    }
};
</script>

<style scoped >
    .demo{
        padding-bottom: 20px;
        border-bottom: 1px solid #333;
        width: 100%;
        position: relative;
    }
</style>

```
:::
~~~

4、像`vue`组件代码一样引入`md`文件

```vue
// app.vue
<template>
    <div class="demo-button">
        <ButtonDemo></ButtonDemo>
    </div>
</template>

<script>
import 'highlight.js/styles/atom-one-dark.css'; // 代码高亮主题
import hljs from 'highlight.js'; // 高亮代码
import ButtonDemo from './ButtonDemo.md';

export default {
    name: 'APP',
    components: {
        ButtonDemo
    },
    mounted(){
        this.$nextTick(() => {
            [...document.querySelectorAll('.vue-demo-highlight pre code:not(.hljs)')].forEach(block => {
                hljs.highlightBlock(block);
            });
        });
    }
};
</script>
```



## 原理

1、`md`文件通过此`loader`，非`vue`代码被`markdown-it`转换为`html`代码。同时`vue`代码被`<pre><code v-pre >`和`</pre></code>`包裹，可用作高亮展示。

2、由于会存在多个`vue`代码，所以将`vue`代码替换为类似：`<component0></component0>、<component1></component1>`，然后在`md`文件底部添加`script`：

```
<script>
	import component0 from './本markdown文件.md?fence&componentIndex=0';
    import component1 from './本markdown文件.md?fence&componentIndex=1';
    export default {
        name: 'ComponentDoc',
        components: {
            component0: component0,
            component1: component1
        }
    };
</script>
```

3、在底部`script`中添加参数重新引入当前`md`文件

4、由于标记了参数，然后此`loader`再次转换这个`md`文件时，只需要返回原来的`vue`源代码交还`vue-loader`处理就行

5、转换结果大致如下：

```js
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
```

注意：以上代码中被`${}`标记的都是可以在`loader`参数中设置的变量



## loader参数

```typescript

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
```

