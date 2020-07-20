/*
 * @Author: Yang Lin
 * @Description: 编译vue单文件组件成js
 * @Date: 2020-07-15 19:33:07
 * @LastEditTime: 2020-07-16 21:40:36
 * @FilePath: \md-vue-loader\src\parseVue.ts
 */ 
const {
    compileTemplate
} = require('@vue/component-compiler-utils');
const compiler = require('vue-template-compiler');
import colors = require('./colors');


function stripScript(source: string): string{
    const result = source.match(/<(script)>([\s\S]+)<\/\1>/);
    return result 
        ? result[2]
            ? result[2].trim()
            : ''
        : '';
}

function stripTemplate(source: string): string{
    const result = source.match(/<(template)>([\s\S]+)<\/\1>/);
    return result 
        ? result[2]
            ? result[2].trim()
            : ''
        : '';
}

function parseVue(
    source: string
){
    const {
        code,
        tips,
        errors
    } = compileTemplate({
        source: `<div>${stripTemplate(source)}</div>`,
        compiler: compiler,
        needMap: false
    });

    if(tips && tips.length > 0){
        tips.forEach((tip: string) => {
            console.log(`[${colors.prompt('md-vue-loader')}]: ${colors.warn(tip)}`);
        });
    }

    if(errors && errors.length > 0){
        errors.forEach((err: string) => {
            console.log(`[${colors.prompt('md-vue-loader')}]: ${colors.error(err)}`);
        })
    }

    const script = stripScript(source);
    const varScript = script 
        ? script.replace(/export\s+default\s?/, 'const componentProps = ')
        : `const componentProps = {};`;
        
    return `(function(){
        ${code}
        ${varScript}

        return {
            render,
            staticRenderFns,
            ...componentProps
        };
    })()`;
}

export = parseVue;
