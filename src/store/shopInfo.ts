import { observable } from 'mobx'

const shopInfoStore = observable({
  shopInfo: null,
  shopInfoStore() {
    this.counter++
  },
  increment() {
    this.counter++
  },
  decrement() {
    this.counter--
  },
  incrementAsync() {
    setTimeout(() => {
      this.counter++
    }, 1000)
  }
})
export default shopInfoStore
