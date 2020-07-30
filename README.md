# markdone-vue-loader

> webpack loader for transform markdown file to Vue Single-File Components. 
>
> If target markdown file contains Vue code and wrapped between `:::demo` and `:::`, then rendered it as children Vue component , also retain the source Vue code.
>
> It useful for writting document for Vue components libary .

**Note**: For markdown-vue-loader has been registed, I used `markdone`.

**Note**: In this document, the `Vue demo code` means that code wrapped between  `:::demo` and `:::`.

[中文说明](README-zh.md)

## Usage

1. Installation

```shell
npm install markdone-vue-loader
```

2. Configuration

```javascript
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

3. Then your markdown files are Vue Single-File Components, the `Vue demo code` support all vue-loader Features as  an child Vue Single-File.
4. [Download this repository](https://github.com/linlinyang/md-vue-loader) and run `npm install && npm run dev`, to show the demo.

## How it works

> The following section is  the internal implementation details of `markdone-vue-loader`, for interested readers

The md file first pass this loader:

1. Use [markdown-it](https://www.npmjs.com/package/markdown-it) convert md file to html.
2. Mark  the `Vue demo code` as `<component0></component0>,<component1></component1>...` with the help of [markdown-it-container](https://www.npmjs.com/package/markdown-it-container). We will regist those customer component in follow steps.
3. Config `md.renderer.rules.fence` to hold the source code, use `v-pre` directive to wrapper it.
4. Return result will be vue component ,so we wrapper the `step 1 html` in `<template></template>`. Append `script` to regist custom component:

```html
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

We config the vue-loader as next , as the `<component0></component0>,<component1></component1>...` rendered, it will reslove this markdown file again with special params.

Then this md file pass this loader second:

1. Parse the params, `fence` is a mark , the `componentIndex` used to get which `Vue demo code` will return.
2. Use regexp to get `Vue demo code` wrapped between  `:::demo` and `:::` and return it.

## Description

The description for this loader convert process.

```js
/**
 * markdone-vue-loader convert exmample
 * 
 * source md：
 * :::${containerName: demo} code description 
 *  ``` vue
 *      vue demo code
 *  ```
 * :::
 * 
 * ===> result
 * 
 * <div class="${demoWrapperClass}">
 *      <slot name="${beforeDemoSlotName}"></slot>
 *          vue demo code render result
 *      <slot name="${afterDemoSlotName}"></slot>
 * </div>
 * 
 * <div class="${descClass}">
 *      <slot name="${beforeDescSlotName}"></slot>
 *          code description
 *     <slot name="${afterDescSlotName}"></slot>
 * </div>
 * 
 * <div class="${highlightClass}">
 *      <slot name="${beforeCodeSlotName}"></slot>
 *      <prev><code class="html" v-pre >
 *          source vue demo code
 *      </code></prev>
 *      <slot name="${afterCodeSlotName}"></slot>
 * </div>
 */
```

**Note**: The variables wrapper `${}` will be setted in loader options

## Loader Options

```typescript

/**
 * markdone-vue-loader Options
 */
interface Options {
    /**
     * @default "demo"
     */
    readonly containerName?: string;
    /**
     * @default "vue-demo-block"
     */
    readonly demoWrapperClass?: string;
    /**
     * @default "vue-demo-desc"
     */
    readonly descWrapperClass?: string;
    /**
     * @default "vue-demo-highlight"
     */
    readonly highlightClass?: string;
    /**
     * @default "beforeVueDemoBlock"
     */
    readonly beforeDemoSlotName?: string,
    /**
     * @default "afterVueDemoBlock"
     */
    readonly afterDemoSlotName?: string,
    /**
     * @default "beforeDescDemoBlock"
     */
    readonly beforeDescSlotName?: string,
    /**
     * @default "afterDescDemoBlock"
     */
    readonly afterDescSlotName?: string,
    /**
     * @default "beforeCodeDemoBlock"
     */
    readonly beforeCodeSlotName?: string,
    /**
     * @default "afterCodeDemoBlock"
     */
    readonly afterCodeSlotName?: string,
    /**
     * markdownit Configuration http://markdown-it.docschina.org/
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
```

