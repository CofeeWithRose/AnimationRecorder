const Koa = require('koa');
const KoaStatic = require('koa-static');
const Path = require('path');
const https = require('https');
const http = require('http');
const enforceHttps = require('koa-sslify').default;
const fs = require('fs');

const app = new Koa();
const options = {
    key: fs.readFileSync('./ssl/server.key'),  //ssl文件路径
    cert: fs.readFileSync('./ssl/server.crt')  //ssl文件路径
};

app.use(enforceHttps());

app.use( KoaStatic(Path.resolve(__dirname,'../'),{defer: true, }) );
app.use( (context, next) => {
    const url = context.request.url || '';
    if(/\/[^\.|\/]+$/.test(url)){
        context.request.url = `${url}.js`
    }
    console.log(context.request.url)
    next();
})
// app.listen(3000);

http.createServer(app.callback()).listen(80);
https.createServer(options, app.callback()).listen(443);
console.log(`https://localhost/demo/`);