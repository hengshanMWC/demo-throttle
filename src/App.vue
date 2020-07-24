<template>
  <div id="app">
    <input type="tel" placeholder="请输入手机号" v-model="phoneRef" maxlength="11">
    <throttle ref="throttleRef" v-slot="slotProps" @ongoing="handleOngoing">
      <button @click="handleVerify">{{slotProps.time ? slotProps.time : '获取验证码'}}</button>
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
    const phoneRef = ref('') // 手机号码
    const throttleRef = ref(null) // 获取throttl的实例
    function handleOngoing (value) {
      console.log(`请骚等${value}秒`)
    }
    // 做验证
    function handleVerify () {
      // start转交给其他组件操作，更加灵活
      if (phoneRef.value.length === 11) {
        throttleRef.value.start(() => getCode())
      } else {
        console.warn('请输入正确的手机号码')
      }
    }
    // 假设这是个获取code的接口
    function getCode () {
      alert('发送成功')
      return true
    }
    return {
      phoneRef,
      throttleRef,
      handleOngoing,
      handleVerify
    }
  }
})
</script>
