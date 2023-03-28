<template>
    <div v-for="obj in object" :key="obj.ProjectId" class="b-page-object">
        <bread-crumbs :header="obj.name"></bread-crumbs>

        <h1>{{ obj.name }}</h1>    

        <div class="container text-center">

            <div class="row">
                <div class="col">
                    <input class="form-control form-control-lg" name="image" id="file" type="file" ref="file" @change="handleFileUpload()">
                </div>

                <input type="hidden" v-model="fields.ProjectId">

                <div class="col">
                    <button type="submit" class="btn btn-primary mb-3" @click="submitFile()">Сохранить</button>
                </div>
            </div>            

        </div>
    </div>
</template>

<script>
import ObjectsDataService from '@/services/ObjectsDataService';
import ObjectDataService from '@/services/ObjectDataService';
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
            fields: {
                ProjectId: 0,
                image: '',
                width: 0,
                height: 0
            }
        }
    },
    methods: {
        getObject(id) {
            ObjectsDataService.get(id)
                .then(response => {
                    this.object = response.data
                    //console.log(this.object)
                })
                .catch(e => {
                    console.log(e)
                })
        },
        handleFileUpload(){
            this.fields.image = this.$refs.file[0].files[0]
        },
        submitFile(){
            let formData = new FormData();
            formData.append('file', this.fields.image);

            // let data = {
            //     ProjestID: this.fields.ProjectId,
            //     image: this.fields.image.name,
            // }

            // ObjectDataService.create(data)
            // .then(response => {
            //     console.log(response)
            // })
            // .catch(e => {
            //     console.log(e)
            // })

            //console.log(this.fields.image)

            ObjectDataService.upload(formData)
            .then(response => {
                return response
            })
            .catch(e => {
                console.log(e)
            })

            //console.log(formData);


        }
    },
    mounted() {
        this.getObject(this.$route.params.id)
        this.fields.ProjectId = this.$route.params.id
    },

}
</script>

<style>
.b-page-object {
    width: 100%;
    padding: 20px;
}
</style>