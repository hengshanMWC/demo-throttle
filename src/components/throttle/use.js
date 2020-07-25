import { ref } from 'vue'
export function useTime (secondsRef, emit) {
  const timeRef = ref(0)
  const timerRef = ref(0)
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
        timeRef.value = secondsRef.value
        emit('change', timeRef.value)
        startTime()
      }
      loading = false
    } else {
      emit('ongoing', timeRef.value)
    }
  }
  // 倒计时
  function startTime () {
    clearTimeout(timerRef.value)
    timerRef.value = setTimeout(() => {
      if (timeRef.value <= 0) {
        clearTimeout(timerRef.value)
      } else {
        emit('change', --timeRef.value)
        startTime()
      }
    }, 1000)
  }
  return {
    timeRef,
    timerRef,
    start,
    startTime
  }
}
export function useCache (cacheID, cacheType) {
  const key = 'throttle' + cacheID
  function getCache () {
    const time = Number(window[cacheType].getItem(key)) - Date.now()
    return time > 0 ? time / 1000 : 0
  }
  function setCache (seconds) {
    const time = seconds * 1000 + Date.now()
    window[cacheType].setItem(key, time.toString())
  }
  function removeCache () {
    window[cacheType].removeItem(key)
  }
  return {
    getCache,
    setCache,
    removeCache
  }
}