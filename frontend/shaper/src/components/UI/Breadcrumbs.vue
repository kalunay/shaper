<template>
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="/">Home</a></li>
    <li class="breadcrumb-item active" aria-current="page">{{ header }}</li>
  </ol>
</nav>
</template>

<script>
export default {
    name: 'bread-crumbs',
    props: {
        header: {
            type: String
        }
    }
}
</script>

<style scoped>
    nav {
        padding: 0;
    }
</style>