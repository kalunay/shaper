<template>
    <div class="wrapper">
      <HouseInfo />
    </div>
  </template>
    
  <script>
  import HouseInfo from '@/components/HouseInfo.vue'
  
  export default {
    name: 'HouseInfoView',
    components: {
        HouseInfo
    }
  }
  </script>
  
  <style>
  .wrapper {
    background-color: rgb(245, 247, 251);
  }
  </style>
    