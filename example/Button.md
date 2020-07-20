## Button 组件

一、`Button` 组件的基本使用

:::demo #### Button 组件基础使用一111。
```vue

<template>
    <div>
        <p>There some demos for Button component.</p>
        <Buttom @click="onClick">Click</Buttom>
    </div>
</template>

<script>
import Buttom from './Button';

export default {
    name: 'APP',
    components: {
        Buttom
    },
    methods: {
        onClick() {
            console.log('点击按钮');
        }
    }
};
</script>

```
:::

