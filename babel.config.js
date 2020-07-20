/*
 * @Author: Yang Lin
 * @Description: babel.config
 * @Date: 2020-07-06 21:11:37
 * @LastEditTime: 2020-07-08 19:59:08
 * @FilePath: \md-vue-loader\babel.config.js
 */ 

 
module.exports = api => {
    api.cache(true); // 缓存这个配置文件，不用每次编译都导入
    const presets = [
        [
            '@babel/preset-env',{
                'modules': false
            }
        ]
    ];

    const plugins = [
        [
            '@babel/plugin-transform-runtime',{
                corejs: 3
            }
        ]
    ];
    
    return {
        presets,
        plugins
    };
}