import { defineStore } from 'pinia'

export const useIndexStore = defineStore('index',()=>{
  const test=ref({active:false,label:''})

  return {test}
})
