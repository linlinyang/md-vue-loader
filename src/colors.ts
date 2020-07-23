/*
 * @Author: Yang Lin
 * @Description: 简介
 * @Date: 2020-07-12 17:27:40
 * @LastEditTime: 2020-07-23 20:24:34
 * @FilePath: f:\sourcecode\md-vue-loader\src\colors.ts
 */ 

const colors = require('colors');

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

export = colors;