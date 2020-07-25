<template>
  <div>
    <slot :time="timeRef"></slot>
  </div>
</template>
<script>
import { defineComponent, ref, onUnmounted, watch } from 'vue'
export default defineComponent({
  name: 'throttle',
  props: {
    // 倒计时间
    seconds: {
      type: Number,
      default: 60
    },
    isCache: Boolean,
    cacheObject: {
      type: Object,
      default: () => localStorage
    },
    cacheID: {
      validator: () => true,
      default: 0,
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
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (timeRef.value <= 0) {
          clearTimeout(timer)
        } else {
          content.emit('change', --timeRef.value)
          startTime()
        }
      }, 1000)
    }
    // 缓存模块
    watch(() => timeRef.value, function (value) {
      if (props.isCache) {
        if (value <= 0) {
          removeCache()
        } else {
          setCache(value)
        }
      }
    })
    const key = 'throttle' + props.cacheID
    function getCache () {
      const time = Number(props.cacheObject.getItem(key)) - Date.now()
      return time > 0 ? time / 1000 : 0
    }
    function setCache (seconds) {
      const time = seconds * 1000 + Date.now()
      props.cacheObject.setItem(key, time.toString())
    }
    function removeCache () {
      props.cacheObject.removeItem(key)
    }
    // 初始化
    (function () {
      if (props.isCache) {
        timeRef.value = Math.round(getCache())
        startTime()
      }
      removeCache()
    })()
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