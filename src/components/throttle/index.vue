<template>
  <div>
    <slot :time="timeRef"></slot>
  </div>
</template>
<script>
import { defineComponent, onUnmounted, watch, ref } from 'vue'
import { useTime, useCache } from './use.js'
export default defineComponent({
  name: 'throttle',
  props: {
    // 倒计时间
    seconds: {
      type: Number,
      default: 60
    },
    isCache: Boolean,
    cacheType: {
      type: String,
      default: 'localStorage'
    },
    cacheID: {
      validator: () => true,
      default: 0,
    }
  },
  // 数据出口
  setup (props, { emit }) {
    const secondsRef = ref(props.seconds)
    watch(() => props.seconds, function (value) {
      secondsRef.value = value
    })
    const {
      timeRef,
      timerRef,
      start,
      startTime
    } = useTime(secondsRef, emit)
    const { 
      getCache,
      setCache,
      removeCache
    } = useCache(props.cacheID, props.cacheType)
    // 监听
    watch(() => timeRef.value, function (value) {
      if (props.isCache) {
        if (value <= 0) {
          removeCache()
        } else {
          setCache(value)
        }
      }
    })
    // 销毁记得清除定时器
    onUnmounted(() => {
      clearTimeout(timerRef.value)
    })
    function init () {
      if (props.isCache) {
        timeRef.value = Math.round(getCache())
        startTime()
      }
      removeCache()
    }
    init()
    return {
      start,
      timeRef
    }
  }
})
</script>