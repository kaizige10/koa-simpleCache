const Koa = require('koa')
const router = require('koa-router')()
const static = require('koa-static')
const SimpleCache = require('./simpleCache')
const app = new Koa()
app.use(static(__dirname + '/'))

const cacheConfig = {
    pattern: /^\/api\/data\/\w+$/,
    expireTime: '*/5 * * * * *',
    // expireInterval: 5000
}
app.use(new SimpleCache(cacheConfig));

router.get('/api/data/citys', ctx => {
    const citys = require('./citys.json')
    ctx.body = citys
})
router.post('/api/data/citys', ctx => {
    const citys = require('./citys.json')
    ctx.body = citys
})

router.get('/api/userInfo', ctx => {
    ctx.body = {
        id: '123456',
        name: 'kaizige'
    }
})

app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
    console.log('server start on port 3000')
})