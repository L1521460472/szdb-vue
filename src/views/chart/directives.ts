/*
 * @Descripttion:
 * @version:
 * @Author: hy1125
 * @Date: 2021-06-10 17:25:06
 * @LastEditors: hy1125
 * @LastEditTime: 2021-11-17 11:06:45
 */
export default {
  // 使用局部注册指令的方式
  resize: {
    // 指令的名称
    bind(el: any, binding: any) {
      // el为绑定的元素，binding为绑定给指令的对象
      let width: (string | undefined) = ''
      let height: (string | undefined) = ''
      function isReize() {
        const style = document.defaultView?.getComputedStyle(el)
        if (width !== style?.width || height !== style?.height) {
          binding.value() // 关键
        }
        width = style?.width
        height = style?.height
      }
      el.__vueSetInterval__ = setInterval(isReize, 300)
    },
    unbind(el: any) {
      clearInterval(el.__vueSetInterval__)
    }
  }
}
