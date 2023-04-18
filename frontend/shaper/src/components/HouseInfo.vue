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

            <div class="row b-main-content" id="main-content">
                <div class="" id="canvas">

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

                <div id="card">
                    <div class="card text-center">
                        <div class="card-header">
                            Добавление Дома №{{ this.$route.params.house_id }}
                            <span class="glyphicon glyphicon-menu-down" id="addForm"></span>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label>Координаты</label><br>
                                <!-- <textarea class="form-control" v-model="shapes.coordinates" disabled rows="3"></textarea> -->
                                {{ shapes.coordinates }}
                            </div>
                            <div class="mb-3">
                                <label>Этажи <i>([-1,1,2,3])</i></label>
                                <input class="form-control" v-model="this.fields.floors" type="text" required>
                            </div>
                            <input type="hidden">
                            <button type="button" class="btn btn-success w-100" >Сохранить</button>
                        </div>
                        <div class="card-footer text-body-secondary">
                            Объект: <i>{{ object.name }}</i>
                        </div>
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
        watch: {
            '$route.params': {
                handler(newValue) {
                    this.getObject(newValue.id)
                    this.fields.ProjectId = this.$route.params.id
                    this.getHouse()
                    this.addImageOnCanvas()
                },
                immediate: false,
            },
            colorBrush: {
                handler(newValue) {
                    this.addImageOnCanvas(newValue)
                }
            }
        },
        name: 'HouseInfo',
        data(){
            return {
                links: [],
                object: {},
                fields: {
                    ProjectId: this.$route.params.id,
                    floors: [],
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
                scale: 1,
                listScale: [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3],
                colorBrush: '#000',
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
                        this.fields.image = response.data[0].image
                        this.fields.width = response.data[0].width
                        this.fields.height = response.data[0].height
                        this.fields.sections = response.data[0].sections
                        this.fields.shapeId = response.data[0].shapeId                    
                        this.defaultObject = true                        
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
                let ctx = canvas.getContext('2d')

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

                console.log(this.fields.image)

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
            clearCanvas() {
                let canvas = document.getElementById("myCanvas")
                let ctx = canvas.getContext('2d')
                ctx.clearRect(0, 0, this.fields.width, this.fields.height)
                this.addImageOnCanvas()
                //this.coordinits = []
                this.house = {
                    header: '',
                    description: '',
                    projectId: 0,
                    numHouse: 0,
                    sections: ''
                }
            },
            scaleCanvas(scale) {
                this.scale = scale
                this.fields.width *= scale
                this.fields.height *= scale
                this.addImageOnCanvas()
                console.log(this.fields.width)
                console.log(this.fields.height)
            },
            getPathSvg() {
                //return 'M ' + this.coordinits.join(" ") + ' Z'
                //return this.shapes.coordinates = this.coordinits
                console.log('111111')
            },
            getSizeForSvg() {
                let ds = Math.ceil(this.fields.width / this.fields.height)
                return '0 0 ' + Math.ceil(this.fields.width / ds) + ' ' + Math.ceil(this.fields.height / ds)
            }
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
            }, 1000)

            const card = document.getElementById('addForm')

            card.addEventListener('click', function () {
                var navMenu = document.getElementById("main-content");
                navMenu.classList.toggle("hidden");
            })

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
    .b-page-object {
        width: 100%;
        padding: 20px;
    }

    .b-scroll {
        overflow: scroll;
        display: flex;
        flex-direction: column;
        padding: 0;
        box-shadow: 0 0 10px rgba(0, 0, 0, .3);
        height: calc(100vh - 210px);
        border-radius: 0 0 10px 10px;
    }

    #myCanvas {
        display: block;
        margin: auto;
    }

    .card-header,
    .card-footer {
        background-color: rgba(33, 37, 41, 0.1);
        font-weight: bold;
        color: rgba(33, 37, 41, 0.75)
    }

    .card-footer {
        font-weight: normal;
    }

    .card-footer i {
        font-style: normal;
        font-weight: bold;
    }

    .block-btn-group {
        background-color: rgba(33, 37, 41, 0.1);
        font-weight: bold;
        color: rgba(33, 37, 41, 0.75);
        padding: 0;
        padding: 10px 15px;
        border-radius: 10px 10px 0 0;
    }

    .card-body i {
        display: block;
        font-size: 10px;
    }
    .block-btn-group {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .card {
        margin-left: 10px;
        margin-right: 10px;
    }

    .b-main-content {
        display: flex;
        flex-direction: row;
    }

    .glyphicon {
        font-family: "Glyphicons Halflings";
    }
    .glyphicon-menu-down::before {
        content: "\2212";
        font-family: "Glyphicons Halflings";
    }

    .hidden #card .card-body { display: none; }

    .hidden #card .glyphicon-menu-down::before { content: "\002b"; }

    #canvas { width: calc(100% - 260px); }
    #card { width: 260px; }
    .hidden #canvas { 
        width: 100%; 
        transition: 1s;
        animation: show 3s 1;
        animation-fill-mode: forwards;
        animation-delay: 1s;  
    }
    .hidden #card { 
        width: 260px;
        position: fixed;
        top: 10px;
        right: 10px;
        transition: 1s;
        animation: show 3s 1;
        animation-fill-mode: forwards;
        animation-delay: 1s;  
     }    
</style>