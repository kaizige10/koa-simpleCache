# koa-simpleCache
a koa simpleCache middleware

## usage
```javascript
const SimpleCache = require('./simpleCache')
const cacheConfig = {
    pattern: /^\/api\/data\/\w+$/,
    expireTime: '*/5 * * * * *',
}
app.use(new SimpleCache(cacheConfig));

```

## notice
- SimpleCache要在router.routes()之前调用，否则无法缓存数据
- pattern指定要缓存的接口的正则表达式
- expireTime指定定时清理缓存的时机（全量清理），格式使用cron的语法，如'0 0 0 * * *'
- expireInterval指定多久后清理接口数据
- supportMethods指定需要缓存的接口method，默认为get

## TODO
- 当前的功能较为简单，只能配置一种pattern进行缓存
- 可改进点：传入pattern数组，分组进行缓存，清理缓存时也是分组清理的
- 使用通配符代替正则表达式，避免性能问题
- 使用cron来进行定时任务的清理，而不是计时器（已完成）
- 匹配url无需进行两次判断
