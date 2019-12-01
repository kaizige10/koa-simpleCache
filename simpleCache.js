/**
 * 当前的功能较为简单，只能配置一种pattern进行缓存
 * 可改进点：传入pattern数组，分组进行缓存，清理缓存时也是分组清理的
 */
class SimpleCache {
    constructor(config) {
        // 使用正则指定哪些接口需要缓存
        this.pattern = config.pattern;
        // 指定过期时间：每天的固定时间
        this.expireTime = config.expireTime;
        // 指定过期时间：间隔多久，单位ms
        this.expireInterval = config.expireInterval;
        // 缓存
        this.cache = {};
        this.middleware = this.middleware.bind(this)

        this.clearFixedTimeCache()

        return this.middleware
    }

    clearFixedTimeCache() {
        // 清理expireTime, 每秒钟对比一次进行清理
        setInterval(() => {
            const nowTimeStr = (new Date()).toTimeString().slice(0, 8);
            if (nowTimeStr === this.expireTime) {
                console.log('执行clearFixedTimeCache，时间为 %s', this.expireTime)
                this.cache = {};
            }
        }, 1000);
    }

    async middleware(ctx, next) {
        const {
            url,
            method
        } = ctx;
        const key = method + url;
        if (this.pattern.test(url)) {
            var cacheData = this.cache[key];
            if (cacheData) {
                ctx.body = cacheData;
                console.log('获取接口 %s %s 缓存数据成功', method, url)
                // 跳过后面的中间件，直接返回结果
                return;
            } else {
                console.log('没有找到接口 %s %s 缓存', method, url)
            }
        } else {
            console.log('接口 %s %s 无需缓存', method, url)
        }

        await next()

        if (this.pattern.test(url)) {
            // 如果匹配到对应的url，则缓存数据
            this.cache[key] = ctx.body;
            console.log('接口 %s %s 数据缓存成功', method, url)

            if (this.expireInterval) {
                setTimeout(() => {
                    console.log('执行interval清理，接口 %s %s 数据清理成功', method, url)
                    delete this.cache[key]
                }, this.expireInterval);
            }
        }
    }
}

module.exports = SimpleCache;