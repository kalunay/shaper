<template>
    <div class="b-page-object">
        <BreadCrumbs :links="links"></BreadCrumbs>
       <h1>{{ object.name }}</h1>
    </div>
</template>

<script>
    import ObjectsDataService from '@/services/ObjectsDataService';
    export default {
        name: 'HouseInfo',
        data(){
            return {
                links: [],
                object: {}
            }
        },
        methods: {
            getObject(id){
                ObjectsDataService.get(id)
                .then(response => {
                    this.object = response.data[0]
                    console.log('getObject',this.object)
                })
                .catch(e => {
                    console.log(e)
                })                 
            }
        },
        beforeCreate(){

        },
        mounted(){
            this.getObject(this.$route.params.id)
        },
        beforeUpdate(){
            this.links = [
                {'header': this.object.name, 'path': `/object/${this.$route.params.id}`},
                {'header': `Дом №${this.$route.params.house_id}`, 'path': `/object/${this.$route.params.id}/house/${this.$route.params.house_id}`}
            ]            
        }
    }
</script>

<style>
</style>