<template>
    <div class="b-page-object">
        <BreadCrumbs :links="links"></BreadCrumbs>

        <h1>{{ object.name }}</h1>

        <div class="b-pop-coordinates" v-if="subcoordinates.length > 0">
            {{ subcoordinates }}
            <div class="editPopUp">
                <div>
                    <input type="number" class="form-control form-contro-xs" size="2" v-model="floorEdit">
                    <button class="btn btn-primary" @click="editToCoordinates()">Сохранить</button>
                </div>
                <div>
                    <button class="btn btn-info" @click="addToCoordinates()">Добавить</button>
                </div>
            </div>
        </div>

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
                            <button type="button" class="btn btn-danger" @click="drawShapes()">
                                <i class="glyphicon glyphicon-tint"></i> Отрисовать
                            </button>
                        </div> 
                        <div class="btn-group" role="group" v-if="fields.houses.length > 0">
                            <router-link 
                                class="btn" 
                                :class="btnColors[index]"
                                v-for="index in fields.houses" 
                                :key="index"                                
                                :to="`/object/${this.fields.ProjectId}/house/${index}`"
                            >Дом #{{ index }}</router-link>
                        </div>
                    </div>

                    <div class="b-scroll">
                        <canvas id="myCanvas">
                            Your browser does not support the HTML5 canvas tag.
                        </canvas>                        
                    </div>
                </div>
                <div id="card">


                    <!-- <svg :viewBox='this.getSizeForSvg()' xmlns="http://www.w3.org/2000/svg" v-if="coordinits.length > 0">
                        <path
                            fill="none"
                            stroke="red"
                             :d='this.getPathSvg()' />
                    </svg> -->                    

                    <div class="card text-center">
                        <div class="card-header">
                            Добавление дома
                            <span class="glyphicon glyphicon-menu-down" id="addForm"></span>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label>Координаты</label><br>
                                <!-- <textarea class="form-control" v-model="shapes.coordinates" disabled rows="3"></textarea> -->
                                {{ shapes.coordinates }}
                            </div>
                            <div class="mb-3">
                                <label>№ дома <i>([1,2,3])</i></label>
                                <input class="form-control" type="text" v-model="house.houses" required>
                            </div>
                            <div class="mb-3">
                                <label>Номера секций <i>([[89101,89102,89103], [89201,89202,89203], [89301,89302,89303]])</i></label>
                                <textarea class="form-control" v-model="house.sections" rows="3"></textarea>
                            </div>
                            <input type="hidden" v-model="house.projectId">
                            <button type="button" class="btn btn-success w-100" @click="saveObject()">Сохранить</button>

                            <div class="mb-3 mt-3"><label>Удалить координаты по индексу</label></div>
                            <div class="mb-3 d-flex">
                                <select class="form-control" v-model="delIndex">
                                    <option v-for="coord,index in shapes.coordinates" :key="index">{{ index }}</option>
                                </select>
                                <button type="button" class="btn btn-danger" @click="deleteIndex()">Удалить</button>                                
                            </div>                            

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
            links: [],  
            scale: 1,
            listScale: [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3],
            colorBrush: '#000',
            defaultObject: false,
            coordinits: [],
            svgPath: '',
            house: {
                projectId: 0,
                houses: [],
                sections: '',
                shapeId: '',
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
            subcoordinates: [],
            floorEdit: 0,
            btnColors: ['btn-primary', 'btn-secondary', 'btn-success', 'btn-danger', 'btn-warning', 'btn-info', 'btn-dark']
        }
    },
    methods: {
        getObject(id) {
            ObjectsDataService.get(id)
                .then(response => {
                    console.log('getObject', response.data)
                    this.object = response.data
                    this.links = [
                        {'header': response.data.name, 'path': `/object/${this.$route.params.id}`},
                    ]  
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

            let timeDate = Date.parse(new Date());

            //console.log(this.house.sections.split(', '))

            let dataHouse = {
                projectId: this.house.projectId,
                houses: (Array.isArray(this.house.houses) ? this.house.houses : this.house.houses.split(',')),
                sections: (Array.isArray(this.house.sections) ? this.house.sections : this.house.sections.split(',')),
                shapeId: timeDate,
                image: this.fields.image,
                width: this.fields.width,
                height: this.fields.height,               
            }

            let dataShape = {
                shapeId: timeDate,
                image: this.fields.image,
                width: this.fields.width,
                height: this.fields.height, 
                coordinates: this.shapes.coordinates,
                itemsIds: []                
            }

            let data = {
                dataHouse,
                dataShape
            }

            //console.log(dataShape)

            ObjectDataService.createShape(data)
                .then(response => {
                    console.log(response)
                    this.$store.commit('messages/setShow', true)
                })
                .catch(e => {
                    console.log('error create: ', e)
                })

        },
        infoObject() {
            ObjectDataService.info(this.fields.ProjectId)
                .then(response => {
                    console.log('image: ', response.data['item'].image)
                    this.fields.image = response.data['item'].image
                    this.fields.width = response.data['item'].width
                    this.fields.height = response.data['item'].height
                    this.fields.houses = response.data['item'].houses
                    this.fields.sections = response.data['item'].sections
                    this.fields.shapeId = response.data['item'].shapeId                    
                    this.defaultObject = true

                    this.house.houses = response.data['item'].houses
                    this.house.sections = response.data['item'].sections

                    this.shapes.coordinates = response.data['shape'].coordinates                   
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

            //let coordinates = this.shapes.coordinates
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
                //coordinates.push(coord)
                this.subcoordinates = coord
                coord = []
               // this.getPathSvg()
                ctx.closePath()
                ctx.beginPath()
                //console.log(coordinates)
            }

        },
        clearCanvas() {
            let canvas = document.getElementById("myCanvas")
            let ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, this.fields.width, this.fields.height)
            this.addImageOnCanvas()
            //this.coordinits = []
            this.house = {
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
        },
        getSizeForSvg() {
            let ds = Math.ceil(this.fields.width / this.fields.height)
            return '0 0 ' + Math.ceil(this.fields.width / ds) + ' ' + Math.ceil(this.fields.height / ds)
        },
        addToCoordinates(){
            this.shapes.coordinates.push(this.subcoordinates)
            this.subcoordinates = []
        },
        editToCoordinates(){
            console.log(this.floorEdit)
            console.log(this.subcoordinates)
            this.shapes.coordinates[this.floorEdit] = this.subcoordinates
        },
        clearObject(){
            this.shapes.coordinates = []
            this.fields.sections = []
            this.fields.floors = []
        },
        drawShapes(){
            console.log(this.shapes.coordinates)
            let canvas = document.getElementById("myCanvas")
            let ctx = canvas.getContext('2d')

            let newImage = new Image();
            newImage.src = '/images/' + this.fields.image
            newImage.width = this.fields.width
            newImage.height = this.fields.height

            // When it loads
            newImage.onload = () => {
                ctx.drawImage(newImage, 0, 0, this.fields.width, this.fields.height)

                ctx.lineWidth = 1
                ctx.strokeStyle = this.colorBrush

                this.shapes.coordinates.forEach(element => {
                    //console.log(element)
                    element.forEach(elem => {
                        //console.log(elem)
                        let coords = elem.split(',')
                        ctx.lineTo(coords[0] * 2, coords[1] * 2)
                        ctx.stroke()
                    });
                });                    
            }

        },
        deleteIndex(){
            console.log(this.delIndex)
            console.log(this.shapes.coordinates)
            let value = this.delIndex
            let arr = this.shapes.coordinates
            arr = arr.filter(item => item !== value)
            console.log(arr)

            const array = this.shapes.coordinates;
            const index = this.delIndex;
            if (index > -1) { 
                array.splice(index, 1);
            }

            console.log(array); 

        }
    },
    beforeMount(){
        this.getObject(this.$route.params.id)
    },
    mounted() {
        console.log(this.$route.params.id)
        this.getObject(this.$route.params.id)
        this.fields.ProjectId = this.$route.params.id
        this.house.projectId = this.$route.params.id
        this.infoObject()
        setTimeout(() => {
            this.addImageOnCanvas()
        }, 1000);

        const card = document.getElementById('addForm')

        card.addEventListener('click', function () {
            var navMenu = document.getElementById("main-content");
            navMenu.classList.toggle("hidden");
        })

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

.card {
    margin-left: 10px;
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
</style>