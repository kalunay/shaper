<template>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/">Home</a></li>
            <li class="breadcrumb-item" v-for="link, index in links" :key="index">
                <router-link   
                :to="link.path"
                >
                    <a :href="link.path">{{ link.header }}</a>
                </router-link>
            </li>
        </ol>
    </nav>
</template>

<script>
export default {
    name: 'BreadCrumbs',
    props: {
        links: Array
    }
}
</script>

<style scoped>
    nav {
        padding: 0;
    }
</style>