<template>
    <div v-for="obj in object" :key="obj.ProjectId" class="b-page-object">
        <bread-crumbs :header="obj.name"></bread-crumbs>

        <h1>{{ obj.name }}</h1>

        <div class="container">

            <div class="row">
                <div class="col">
                    <input class="form-control form-control-lg" name="image" id="file" type="file" ref="file"
                        @change="handleFileUpload()">
                </div>

                <input type="hidden" v-model="fields.ProjectId">

                <div class="col">
                    <button type="submit" class="btn btn-primary mb-3" @click.prevent="submitFile()">Сохранить</button>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-danger" @click="clearCanvas()">Clear</button>
                        <button type="button" class="btn btn-success" @click="saveCanvas()">Save</button>

                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-info dropdown-toggle" data-bs-toggle="dropdown"
                                aria-expanded="false">
                                Zoom
                            </button>
                            <ul class="dropdown-menu">
                                <li v-for="s in listScale" :key="s"><a class="dropdown-item" href="#"
                                        @click="scaleCanvas(s)">{{ s }}</a></li>
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
            <div class="row b-main-content">
                <div class="col-10 b-scroll">
                    <canvas id="myCanvas" style="border:1px solid #d3d3d3;">
                        Your browser does not support the HTML5 canvas tag.
                    </canvas>
                </div>
                <div class="col-2"> </div>
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
                this.addImageOnCanvas()
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
            },
            scale: 1,
            listScale: [1, 1.25, 1.5, 1.75, 2],
            defaultObject: false
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
        handleFileUpload() {
            this.fields.image = this.$refs.file[0].files[0]
            let reader = new FileReader();
            let image = new Image()
            let width = 0
            let height = 0
            reader.readAsDataURL(this.$refs.file[0].files[0]);
            reader.onload = function (e) {
                image.src = e.target.result;
                image.onload = function () {
                    width = this.width
                    height = this.height
                }
            }
            setTimeout(() => {
                this.fields.width = width
                this.fields.height = height
            }, 300)
        },
        submitFile() {
            let formData = new FormData();
            formData.append('file', this.fields.image);

            ObjectDataService.upload(formData)
                .then(response => {
                    //return response
                    //this.fields.image = response.data[0].image.name
                    console.log(response)
                })
                .catch(e => {
                    console.log('error upload image: ', e)
                })

            //console.log(formData);

            // console.log('image: ', this.fields.image)

            let data = {
                ProjectId: this.fields.ProjectId,
                image: this.fields.image.name,
                width: this.fields.width,
                height: this.fields.height,
            }

            //console.log('DATA: ', data)
            //console.log('default image: ', this.defaultObject)
            if (!this.defaultObject) {
                ObjectDataService.create(data)
                    .then(response => {
                        console.log(response)
                    })
                    .catch(e => {
                        console.log('error create: ', e)
                    })
            } else {
                ObjectDataService.update(data)
                    .then(response => {
                        console.log('update: ', response)
                        this.fields.image = response.data.image
                        this.infoObject()
                        this.addImageOnCanvas()
                    })
                    .catch(e => {
                        console.log('error update: ', e)
                    })
            }

            //console.log(this.fields.image)


        },
        infoObject() {
            ObjectDataService.info(this.fields.ProjectId)
                .then(response => {
                    console.log('image: ', response.data[0].image)
                    this.fields.image = response.data[0].image
                    this.fields.width = response.data[0].width
                    this.fields.height = response.data[0].height
                    this.defaultObject = true
                })
                .catch(e => {
                    console.log('error info: ', e)
                })
        },
        addImageOnCanvas() {
            let canvas = document.getElementById("myCanvas");
            canvas.width = this.fields.width
            canvas.height = this.fields.height
            let ctx = canvas.getContext('2d');

            // Create our image
            let newImage = new Image();
            newImage.src = '/images/' + this.fields.image
            newImage.width = this.fields.width
            newImage.height = this.fields.height

            // When it loads
            newImage.onload = () => {
                console.log(newImage)
                // Draw the image onto the context with cropping
                ctx.drawImage(newImage, 0, 0, this.fields.width, this.fields.height);
            }

            ctx.lineWidth = 2;
            //ctx.scale(this.scale, this.scale)
            let sc = this.scale
            canvas.onmouseup = function (event) {
                let x = event.offsetX;
                let y = event.offsetY;
                ctx.lineTo(x, y); //рисуем линию
                console.log(Math.ceil(x/sc), Math.ceil(y/sc))

                ctx.stroke();
            }

        },
        clearCanvas() {
            let canvas = document.getElementById("myCanvas");
            let ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, this.fields.width, this.fields.height);
            this.addImageOnCanvas()
        },
        scaleCanvas(scale) {
            this.scale = scale
            this.fields.width *= scale
            this.fields.height *= scale
            this.addImageOnCanvas()
        }
    },
    mounted() {
        this.getObject(this.$route.params.id)
        this.fields.ProjectId = this.$route.params.id
        this.infoObject()
        setTimeout(() => {
            this.addImageOnCanvas()
        }, 1000);

        //    // size of image
        //    this.$axios.get('/images/logo-awardee-2023.jpg').then(response => {

        //     // get body data
        //     console.log('vue resourses: ', response);

        //     }, response => {
        //     // error callback
        //     console.log(response)
        //     });
    },

}
</script>

<style>
.b-page-object {
    width: 100%;
    padding: 20px;
}

.b-scroll {
    overflow: scroll;
    display: block;
    padding: 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, .3);
}

#myCanvas {
    display: block;
    margin: auto;
}</style>