// 注意：引入的方式
// 引入koa
const koa = require('koa2');
const app = new koa();

const static = require('koa-static');
app.use((ctext, next)=>{
    console.log(ctext.request.url);
    next();
})
// 配置静态web服务的中间件
app.use(static(__dirname+'\\demo'));
console.log(__dirname+'\\demo')    
// 监听端口≈
app.listen(3000,function(){
    console.log('启动成功');
});