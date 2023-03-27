<template>
    <div v-for="obj in object" :key="obj.ProjectId" class="b-page-object">
        <bread-crumbs :header="obj.name"></bread-crumbs>

        <h1>{{ obj.name }}</h1>    

        <div class="container text-center">

            <div class="row">
                <div class="col">
                    <input class="form-control form-control-lg" id="formFileLg" type="file">
                </div>

                <div class="col">
                    <button type="submit" class="btn btn-primary mb-3">Сохранить</button>
                </div>
            </div>            

        </div>
    </div>
</template>

<script>
import ObjectsDataService from '@/services/ObjectsDataService';
export default {
    watch: {
        '$route.params': {
            handler(newValue) {
                this.getObject(newValue.id)
            },
            immediate: false,
        }
    },

    name: "ObjectInfo",
    data() {
        return {
            object: null,
        }
    },
    methods: {
        getObject(id) {
            ObjectsDataService.get(id)
                .then(response => {
                    this.object = response.data
                    console.log(this.object)
                })
                .catch(e => {
                    console.log(e)
                })
        }
    },
    mounted() {
        this.getObject(this.$route.params.id)
    },

}
</script>

<style>
.b-page-object {
    width: 100%;
    padding: 20px;
}
</style>