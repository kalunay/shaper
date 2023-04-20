<template>
    <div class="wrapper">
      <FloorInfo />
    </div>
  </template>
    
  <script>
  import FloorInfo from '@/components/FloorInfo.vue'
  
  export default {
    name: 'FloorInfoView',
    components: {
        FloorInfo
    }
  }
  </script>
  
  <style>
  .wrapper {
    background-color: rgb(245, 247, 251);
  }
  </style>
    