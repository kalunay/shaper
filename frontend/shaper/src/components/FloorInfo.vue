<template>
    <div class="b-page-object">
        <BreadCrumbs :links="links"></BreadCrumbs>
        <h1>Этаж №{{ this.$route.params.floor_id }}, <i>Дом №{{ this.$route.params.house_id }}</i>, <i>{{ object.name }}</i></h1>

        <div class="container">
            <div class="row">
                <div class="col">
                    <input class="form-control form-control-lg" name="image" id="file" type="file" ref="file" @change="handleFileUpload()">
                </div>

                <div class="col">
                    <button type="submit" class="btn btn-primary mb-3" @click.prevent="submitFile()">Сохранить</button>
                </div>
            </div>
        </div>

    </div>
</template>
    
<script>
    import ObjectsDataService from '@/services/ObjectsDataService'
    export default {
        watch: {
            '$route.params': {
                handler(newValue) {
                    this.getObject(newValue.id)
                },
                immediate: false,
            },
        },
        name: "FloorInfo",
        data(){
            return {
                links: [],
                object: {},
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
            },            
        },
        beforeMount(){
            this.getObject(this.$route.params.id)
            console.log('getObject', this.$route.params.id)
        },
        mounted(){
            this.getObject(this.$route.params.id)
        },
        beforeUpdate(){
            this.links = [
                {'header': this.object.name, 'path': `/object/${this.$route.params.id}`},
                {'header': `Дом №${this.$route.params.house_id}`, 'path': `/object/${this.$route.params.id}/house/${this.$route.params.house_id}`},
                {'header': `Этаж №${this.$route.params.floor_id}`, 'path': `/object/${this.$route.params.id}/house/${this.$route.params.house_id}/floor/${this.$route.params.floor_id}`}
            ]  
        },
    }
</script>

<style>

</style>