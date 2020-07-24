<template>
  <div>
    <slot :time="timeRef"></slot>
  </div>
</template>
<script>
import { defineComponent, ref, onUnmounted } from 'vue'
export default defineComponent({
  name: 'throttle',
  props: {
    // 倒计时间
    seconds: {
      type: Number,
      default: 60
    }
  },
  // 数据出口
  setup (props, content) {
    // 响应式时间
    const timeRef = ref(0)
    // 定时器id
    let timer
    let loading = false
    /** 
     * 开始
     * @param {Function} cd
    */
    async function start (cd) {
      if (timeRef.value === 0 && !loading) {
        loading = true
        const b = await cd()
        if (b) {
          timeRef.value = props.seconds
          content.emit('change', timeRef.value)
          startTime()
        }
        loading = false
      } else {
        content.emit('ongoing', timeRef.value)
      }
    }
    // 倒计时
    function startTime () {
      timer = setTimeout(() => {
        if (timeRef.value <= 0) {
          clearTimeout(timer)
        } else {
          content.emit('change', --timeRef.value)
          startTime()
        }
      }, 1000)
    }
    // 销毁记得清除定时器
    onUnmounted(() => {
      clearTimeout(timer)
    })
    return {
      start,
      timeRef
    }
  }
})
</script>