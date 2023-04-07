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

            <div class="row b-main-content">
                <div class="col-10 b-scroll">

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

                    <canvas id="myCanvas">
                        Your browser does not support the HTML5 canvas tag.
                    </canvas>
                </div>
                <div class="col-2">


                    <!-- <svg :viewBox='this.getSizeForSvg()' xmlns="http://www.w3.org/2000/svg" v-if="coordinits.length > 0">
                        <path
                            fill="none"
                            stroke="red"
                             :d='this.getPathSvg()' />
                    </svg> -->

                    <div class="card text-center">
                        <div class="card-header">
                            Добавление дома
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label>Координаты</label>
                                <textarea class="form-control" :value="this.getPathSvg()" disabled rows="3"></textarea>
                            </div>
                            <div class="mb-3">
                                <label>Заголовок</label>
                                <input class="form-control" v-model="house.header" type="text" required>
                            </div>
                            <div class="mb-3">
                                <label>№ дома</label>
                                <input class="form-control" type="number" v-model="house.numHouse" required>
                            </div>
                            <div class="mb-3">
                                <label>Номера секций <i>(через запятую)</i></label>
                                <input class="form-control" type="text" v-model="house.sections" required>
                            </div>
                            <div class="mb-3">
                                <label>Описание</label>
                                <textarea class="form-control" v-model="house.description" rows="2"></textarea>
                            </div>
                            <input type="hidden" v-model="house.projectId">
                            <button type="button" class="btn btn-success w-100" @click="saveObject()">Сохранить</button>
                        </div>
                        <div class="card-footer text-body-secondary">
                            Объект: <i>{{ object[0].name }}</i>
                        </div>
                    </div>

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
            colorBrush: '#000',
            defaultObject: false,
            coordinits: [],
            svgPath: '',
            house: {
                header: '',
                description: '',
                projectId: 0,
                numHouse: 0,
                sections: '',
                shapeId: ''
            },
            shapes: {
                shapeId: '',
                image: '',
                width: 0,
                height: 0,
                coordinates: [],
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
        saveObject(){
            let dataHouse = {
                header: this.house.header,
                description: this.house.description,
                projectId: this.house.projectId,
                numHouse: this.house.numHouse,
                sections: this.house.sections
            }

            console.log(dataHouse)

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
            let canvas = document.getElementById("myCanvas")
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
                ctx.drawImage(newImage, 0, 0, this.fields.width, this.fields.height)
            }

            ctx.lineWidth = 2;
            ctx.strokeStyle = this.colorBrush
            //ctx.scale(this.scale, this.scale)
            let sc = this.scale
            let coordinits = this.coordinits
            let ds = Math.ceil(this.fields.width / this.fields.height)
            canvas.onmouseup = function (event) {
                let x = event.offsetX
                let y = event.offsetY
                ctx.lineTo(x, y); //рисуем линию
                coordinits.push(Math.ceil((x / sc) / ds) + ',' + Math.ceil((y / sc) / ds))
                //coordinits.push(Math.ceil(y/sc)/ds)
                ctx.stroke()
            }

        },
        clearCanvas() {
            let canvas = document.getElementById("myCanvas")
            let ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, this.fields.width, this.fields.height)
            this.addImageOnCanvas()
            this.coordinits = []
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
        },
        getPathSvg() {
            return 'M ' + this.coordinits.join(" ") + ' Z'
        },
        getSizeForSvg() {
            let ds = Math.ceil(this.fields.width / this.fields.height)
            return '0 0 ' + Math.ceil(this.fields.width / ds) + ' ' + Math.ceil(this.fields.height / ds)
        }
    },
    mounted() {
        this.getObject(this.$route.params.id)
        this.fields.ProjectId = this.$route.params.id
        this.house.projectId = this.$route.params.id
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
    height: calc(100vh - 170px);
    border-radius: 10px 10px 0 0;
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
</style>