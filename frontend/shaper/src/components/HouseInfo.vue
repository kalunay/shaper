<template>
    <div class="b-page-object">
        <BreadCrumbs :links="links"></BreadCrumbs>
       <h1>Дом №{{ this.$route.params.house_id }}, <i>{{ object.name }}</i></h1>

        <div class="container">
            <div class="row">
                <div class="col">
                    <input class="form-control form-control-lg" name="image" id="file" type="file" ref="file" @change="handleFileUpload()">
                </div>

                <div class="col">
                    <button type="submit" class="btn btn-primary mb-3" @click.prevent="submitFile()">Сохранить</button>
                </div>
            </div>

            <div class="row b-main-content">
                <div class="col-10">

                    <div class="block-btn-group">
                        <div class="btn-group" role="group" aria-label="Basic example">
                            <button type="button" class="btn btn-danger" @click="clearCanvas()">
                                <i class="glyphicon glyphicon-trash"></i> Очистить
                            </button>

                            <div class="btn-group" role="group">
                                <button type="button" class="btn btn-info dropdown-toggle" data-bs-toggle="dropdown">
                                    <i class="glyphicon glyphicon-zoom-in"></i> Увеличить
                                </button>
                                <ul class="dropdown-menu">
                                    <li v-for="s in listScale" :key="s">
                                        <a class="dropdown-item" href="#" @click="scaleCanvas(s)">{{ s }}</a>
                                    </li>
                                </ul>
                            </div>
                            <div class="btn-group" role="group">
                                <input type="color" v-model="colorBrush" />
                            </div>
                        </div>
                    </div>

                    <div class="b-scroll">
                        <canvas id="myCanvas">
                            Your browser does not support the HTML5 canvas tag.
                        </canvas>                        
                    </div>
                </div>
                
            </div>

        </div>
    </div>
</template>

<script>
    import ObjectsDataService from '@/services/ObjectsDataService'
    import HouseDataService from '@/services/HouseDataService'
    export default {
        name: 'HouseInfo',
        data(){
            return {
                links: [],
                object: {},
                fields: {
                    ProjectId: this.$route.params.id,
                    houses: [],
                    sections: [],
                    shapeId: 0,
                    image: '',
                    width: 0,
                    height: 0,  

                },
                shapes: {
                    shapeId: '',
                    image: '',
                    width: 0,
                    height: 0,
                    coordinates: [],
                    itemsIds: []
                },
                defaultHouse: false,
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
            getHouse() {
                HouseDataService.info(this.$route.params.id, this.$route.params.house_id)
                    .then(response => {
                        console.log(response)
                    })
                    .catch(e => {
                        console.log('error info: ', e)
                    })
            },
            handleFileUpload() {
                this.fields.image = this.$refs.file.files[0]
                console.log(this.fields.image)
                let reader = new FileReader();
                let image = new Image()
                let width = 0
                let height = 0

                reader.readAsDataURL(this.$refs.file.files[0]);
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
                
                HouseDataService.upload(formData)
                    .then(response => {
                        console.log(response)
                    })
                    .catch(e => {
                        console.log('error upload image: ', e)
                    })

                let data = {
                    ProjectId: this.fields.ProjectId,
                    image: this.fields.image.name,
                    width: this.fields.width,
                    height: this.fields.height,
                    numHouse: this.$route.params.house_id                    
                }    

                if (!this.defaultObject) {
                    HouseDataService.create(data)
                        .then(response => {
                            console.log(response)
                        })
                        .catch(e => {
                            console.log('error create: ', e)
                        })
                } else {
                    HouseDataService.update(data)
                        .then(response => {
                            console.log('update: ', response)
                            this.fields.image = response.data.image
                            this.getObject(this.$route.params.id)
                            //this.addImageOnCanvas()
                        })
                        .catch(e => {
                            console.log('error update: ', e)
                        })
                }
            },
            addImageOnCanvas() {
                let canvas = document.getElementById("myCanvas")
                canvas.width = this.fields.width
                canvas.height = this.fields.height
                let ctx = canvas.getContext('2d');

                let coordinates = this.shapes.coordinates
                //this.shapes.coordinates = coordinates

                // Create our image
                let newImage = new Image();
                newImage.src = '/images/' + this.fields.image
                newImage.width = this.fields.width
                newImage.height = this.fields.height

                // When it loads
                newImage.onload = () => {
                    console.log(newImage)
                    // Draw the image onto the context with cropping
                    ctx.drawImage(newImage, 0, 0, this.fields.width, this.fields.height)
                }

                ctx.lineWidth = 2;
                ctx.strokeStyle = this.colorBrush
                //ctx.scale(this.scale, this.scale)
                let sc = this.scale
                let coord = []
                let ds = Math.ceil(this.fields.width / this.fields.height)
                canvas.onmouseup = function (event) {
                    let x = event.offsetX
                    let y = event.offsetY
                    ctx.lineTo(x, y); //рисуем линию
                    coord.push(Math.ceil((x / sc) / ds) + ',' + Math.ceil((y / sc) / ds))
                    //coordinits.push(Math.ceil(y/sc)/ds)
                    ctx.stroke()
                // this.getPathSvg()
                }

                canvas.ondblclick = (event) => {
                    console.log(event)
                    coord.pop()
                    coordinates.push(coord)
                    coord = []
                // this.getPathSvg()
                    ctx.closePath()
                    ctx.beginPath()
                    console.log(coordinates)
                }

            },
        },
        beforeCreate(){

        },
        beforeUpdate(){
            this.links = [
                {'header': this.object.name, 'path': `/object/${this.$route.params.id}`},
                {'header': `Дом №${this.$route.params.house_id}`, 'path': `/object/${this.$route.params.id}/house/${this.$route.params.house_id}`}
            ]            
        },
        mounted(){
            this.getObject(this.$route.params.id)
            this.getHouse()

            setTimeout(() => {
                this.addImageOnCanvas()
            }, 1000);

        }
    }
</script>

<style scoped>
    h1 i {
        font-style: normal;
        font-size: 16px;
    }
    .b-page-object {
        width: 100%;
        padding: 20px;
    }
</style>