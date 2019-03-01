const Koa = require('koa');
const KoaStatic = require('koa-static');
const Path = require('path');

const app = new Koa();

app.use( KoaStatic(Path.resolve(__dirname,'../'),{defer: true, }) );
app.use( (context, next) => {
    const url = context.request.url || '';
    if(/\/[^\.|\/]+$/.test(url)){
        context.request.url = `${url}.js`
    }
    console.log(context.request.url)
    next();
})
app.listen(3000);
console.log(`http://localhost:3000`);