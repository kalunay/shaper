<template>
    <div class="wrapper">
      <ObjectInfo />
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  import ObjectInfo from '@/components/ObjectInfo.vue'
  
  export default {
    name: 'ObjectInfoView',
    components: {
        ObjectInfo
    }
  }
  </script>
  