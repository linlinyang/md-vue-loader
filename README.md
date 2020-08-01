# markdone-vue-loader

> webpack loader for transform markdown file to Vue Single-File Components. 
>
> If target markdown file contains Vue code and wrapped between `:::demo` and `:::`, then rendered it as children Vue component , also retain the source Vue code.
>
> It useful for put demo code in md file when writting Vue components libary. 

**Note**: For markdown-vue-loader has been registed, I used `markdone`.

**Note**: In this document, the `Vue demo code` means that code wrapped between  `:::demo` and `:::`.

[中文说明](README-zh.md)

## Usage

1. Installation

```shell
npm install markdone-vue-loader vue-loader
```

2. Configuration webpack

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

> The following section is  the internal implementation details of `markdone-vue-loader`, for interested readers, for easy use.

The md file first pass this loader:

1. Use [markdown-it](https://www.npmjs.com/package/markdown-it) convert md file to html.
2. Mark  the `Vue demo code` as `<component0></component0>,<component1></component1>...` with the help of [markdown-it-container](https://www.npmjs.com/package/markdown-it-container). 
3. Config `md.renderer.rules.fence` to hold the source code, use `vue` built-in directive`v-pre` skip compile.
4. Use `template` wrapper up steps's result as Vue Single-File template.
5. Append script to regist child component for  `vue demo code`:

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

Then, `md` files has been convert to Vue Single-File, and the next loader is `vue-loader`，`import component0 from './this-markdown.md?fence&componentIndex=0';` will resolve this `md` file again with some params.

The md file pass this loader second:

1. Parse the params, `fence` used to distinguish whether it is the first processing , the `componentIndex` used to get which `Vue demo code` will return.
2. Use regexp to get the real `Vue demo code` and return it, then hand it back to ` vue-loader`.

At this point, the processing flow has been completed.

## Convert sample

The convert sample will help to beautify the final results.

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

**Note**: The variables wrapper `${}` will be setted in loader options by yourself. The class and slot property related content do not be convert if not setted.

## Loader Options

```typescript
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
```

