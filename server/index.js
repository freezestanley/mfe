const Koa = require('koa'),
  bodyParser = require('koa-bodyparser'),
  koaStatic = require('koa-static'),
  views = require('koa-views'),
  onerror = require('koa-onerror'),
  xmlParser = require('koa-xml-parser'),
  path = require('path'),
  app = new Koa(),
  router = require('./router'),
  logger = require('../src/until/log');

/***
 * 捕错
 */
onerror(app)

/***
 * 设置静态资源
 */
app.use(koaStatic(path.join(__dirname, '../src/static')))



/***
 * 设置解析
 */
app.use(
    bodyParser({
      enableTypes: ['json', 'form', 'text'],
      formLimit: '50mb',
      textLimit: '50mb'
    })
  )
/***
 * 设置xml解析
 */
app.use(
    xmlParser({
      limit: '30MB', // Reject payloads larger than 1 MB
      encoding: 'UTF-8', // Explicitly set UTF-8 encoding
      xml: {
        normalize: true, // Trim whitespace inside text nodes
        normalizeTags: true, // Transform tags to lowercase
        explicitArray: false // Only put nodes in array if >1
      }
    })
  )

/***
 * 设置views
 */
app.use(views(path.resolve(__dirname, '../src/application')))

/***
 * 请求跨域
 */
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Methods', 'PUT,DELETE,POST,GET')
    ctx.set('Access-Control-Max-Age', 3600 * 24)
    ctx.set('Access-Control-Allow-Credentials', 'true')
    ctx.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  
    if (ctx.method === 'OPTIONS') {
      ctx.body = ''
    }
    console.log(`${ctx.request.method}: ${ctx.request.url}`)
    await next()
  })

/***
 * 设置路由
 */
app.use(router.routes()).use(router.allowedMethods());

logger.trace('starting')
logger.trace('listening on port 3000')
console.log('starting')
console.log('listening on port 3000')
app.listen(3000);