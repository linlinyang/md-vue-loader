
        <template>
            <div class="demo">
                <h2>Button 组件</h2>
<p>一、<code>Button</code> 组件的基本使用</p>
<div class="vue-demo-block">
                    <Button1></Button1>
        
                
                <div class="code-desc"><p>demo #### Button 组件基础使用一111。</p>
</div>

                <div class="highlight">
                    <pre><code class="html">
&lt;template&gt;
    &lt;div&gt;
        &lt;p&gt;There some demos for Button component.&lt;/p&gt;
        &lt;Buttom @click=&quot;onClick&quot;&gt;Click&lt;/Buttom&gt;
    &lt;/div&gt;
&lt;/template&gt;

&lt;script&gt;
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
&lt;/script&gt;

</code></pre>
                </div>

            </div>

            </div>
        </template>

        <script>
            import Button1 from '"F:\\sourcecode\\md-vue-loader\\example\\Button\\Button1.vue"';
            export default {
                name: 'ComponentDoc',
                components: {
                    Button1: Function('(Button1)')()
                }
            };
        </script>
    