<template>

  <div class="container">
    <div class="row">
      <div class="col-lg-12 d-flex">
        <side-bar />
        <router-view/>
      </div>
    </div>
  </div>

</template>

<script>
  import SideBar from './components/SideBar.vue';
  export default {
    name: 'App',
    components: {
      SideBar
    }
  }
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.container {
  width: 100%;
  max-width: 100% !important;
}

.row > * {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

</style>
