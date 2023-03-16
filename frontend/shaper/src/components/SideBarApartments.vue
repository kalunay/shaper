<template>
    <slot>
        <ul>
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
        </ul>   
    </slot>
</template>

<script>
    export default {
        name: 'SideBarApartaments',
        props: {
            projectId: Number
        }
    }
</script>

<style>
</style>