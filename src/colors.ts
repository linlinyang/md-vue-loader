/*
 * @Author: Yang Lin
 * @Description: terminal console
 * @Date: 2020-07-12 17:27:40
 * @LastEditTime: 2020-08-01 22:01:41
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