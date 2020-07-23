<template>
  <div id="app">
    <throttle @ongoing="handleOngoing" @change="handleChange">
      <button>{{time ? time : '获取验证码'}}</button>
    </throttle>
  </div>
</template>

<script>
import throttle from './components/throttle'
import { defineComponent, ref } from 'vue' 
export default defineComponent({
  name: 'App',
  components: {
    throttle
  },
  setup () {
    const timeRef = ref(0)
    function handleChange (value) {
      timeRef.value = value
    }
    function handleOngoing (value) {
      console.log(`请骚等${value}秒`)
    }
    return {
      time: timeRef,
      handleOngoing,
      handleChange
    }
  }
})
</script>

<style>

</style>
