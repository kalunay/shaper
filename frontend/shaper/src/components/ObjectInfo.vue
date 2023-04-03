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
                    <button type="submit" class="btn btn-primary mb-3" @click.prevent="submitFile()">Сохранить</button>
                </div>
            </div> 
            
            <div class="row">
                <div class="col">
                    <canvas id="myCanvas" style="border:1px solid #d3d3d3;">
                        Your browser does not support the HTML5 canvas tag.
                        </canvas>                    
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
                this.fields.ProjectId = this.$route.params.id
                this.infoObject()
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

            if(this.fields.image){
                ObjectDataService.upload(formData)
                .then(response => {
                    //return response
                    this.fields.image = response.data[0].image
                })
                .catch(e => {
                    console.log('error upload: ', e)
                })

                //console.log(formData);
            }

            console.log('image 111: ', this.fields.image)

            // size of image
            let img = new Image();
            let imageData = {};
            img.addEventListener('load', () => {
                imageData = {size: {width: img.width, height: img.height, url: '/images/' + this.fields.image.name}}
            });
            img.src = '/images/' + this.fields.image.name;

            let data = {
                ProjectId: this.fields.ProjectId,
                image: this.fields.image.name,
                width: this.fields.width,
                height: this.fields.height,
            }

            console.log(data)
            console.log('img: ',img)

            ObjectDataService.create(data)
            .then(response => {
                console.log(response)
            })
            .catch(e => {
                console.log('error create: ', e)
            })

            //console.log(this.fields.image)


        },
        infoObject(){       
            ObjectDataService.info(this.fields.ProjectId)
            .then(response => {
                console.log('image: ', response.data[0].image)
                this.fields.image = response.data[0].image
            })
            .catch(e => {
                console.log('error info: ', e)
            })            
        },
        addImageOnCanvas(){
            let canvas = document.getElementById("myCanvas");
            
            let ctx = canvas.getContext('2d');

            // Create our image
            let newImage = new Image();
            newImage.src = '/images/' + this.fields.image

            // When it loads
            newImage.onload = () => {
                // Draw the image onto the context with cropping
                ctx.drawImage(newImage, 0, 0, 5000, 5000, 0, 0, 2500, 2000);
            }
            

        }
    },
    mounted() {
        this.getObject(this.$route.params.id)
        this.fields.ProjectId = this.$route.params.id
        this.infoObject()
        setTimeout(()=>{
            this.addImageOnCanvas()
        }, 1000)
        

    },

}
</script>

<style>
.b-page-object {
    width: 100%;
    padding: 20px;
}
</style>