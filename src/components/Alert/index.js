import Alert from './src/Alert'

export default {
    install (Vue) {
        // 创建构造类
        const AlertConstructor = Vue.extend(Alert)

        const showNextAlert = function (args) {
            // 实例化组件
            const instance = new AlertConstructor({
                el: document.createElement('div')
            })
            // 设置回调函数
            instance.callback = function (action) {
                if (action === 'confirm') {
                    args.resolve(action)
                } else if (action === 'cancel' || action === 'close') {
                    args.reject(action)
                }
            }
            // 处理参数
            for (const prop in args.options) {
                instance[prop] = args.options[prop]
            }
            // 插入Body
            document.body.appendChild(instance.$el)
            Vue.nextTick(() => {
                instance.show = true
            })
        }

        const alertFun = function (options) {
            if (typeof options === 'string' || options === 'number') {
                options = {
                    message: options
                }
                if (typeof arguments[1] === 'string') {
                    options.title = arguments[1]
                }
            }
            return new Promise((resolve, reject) => {
                showNextAlert({
                    options,
                    resolve: resolve,
                    reject: reject
                })
            })
        }

        Vue.prototype.$alert = alertFun
    }
}
