<template>
    <div class="b-page-object">
        <BreadCrumbs :links="links"></BreadCrumbs>
       <h1>Дом №{{ this.$route.params.house_id }}, <i>{{ object.name }}</i></h1>

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

        {{ defaultObject }}

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
                            <button type="button" class="btn btn-danger" @click="drawShapes()">
                                <i class="glyphicon glyphicon-tint"></i> Отрисовать
                            </button>
                        </div>
                        <div class="btn-group" role="group" v-if="fields.floors.length > 0">
                            <router-link 
                                class="btn btn-light" 
                                v-for="index in fields.floors" 
                                :key="index"                                
                                :to="`/object/${this.fields.ProjectId}/house/${this.$route.params.house_id}/floor/${index}`"
                            >Этаж #{{ index }}</router-link>
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
                                <label>Номера секций <i>([89101,89102,89103])</i></label>
                                <input class="form-control" v-model="this.fields.sections" type="text" required>
                            </div>
                            <div class="mb-3">
                                <label>Этажи <i>([-1,1,2,3])</i></label>
                                <input class="form-control" v-model="this.fields.floors" type="text" required>
                            </div>
                            <div class="mb-3">
                                <label>Координаты</label><br>
                                <!-- <textarea class="form-control" v-model="shapes.coordinates" disabled rows="3"></textarea> -->
                                <div class="b-coordinates">{{ shapes.coordinates }}</div>
                            </div>                            
                            <button type="button" class="btn btn-dark w-50" @click="saveObject()">Сохранить</button>
                            <button type="button" class="btn btn-warning w-50" @click="clearObject()">Очистить</button>

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
            'fields.floors': {
                handler(newValue){
                    this.fields.floors = (Array.isArray(newValue) ? newValue : newValue.split(','))
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
                subcoordinates: [],
                defaultObject: false,
                scale: 1,
                listScale: [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3],
                colorBrush: '#000',
                floorEdit: 0,
                delIndex: 0
            }
        },
        methods: {
            getObject(id){
                ObjectsDataService.get(id)
                .then(response => {
                    this.object = response.data
                    console.log('getObject',this.object)
                })
                .catch(e => {
                    console.log(e)
                })                 
            },
            getHouse() {
                HouseDataService.info(this.$route.params.id, this.$route.params.house_id)
                    .then(response => {
                        console.log('getHouse', response)
                        this.fields.image = response.data['item'].image
                        this.fields.width = response.data['item'].width
                        this.fields.height = response.data['item'].height
                        this.fields.sections = response.data['item'].sections
                        this.fields.floors = response.data['item'].floors
                        this.fields.shapeId = response.data['item'].shapeId   

                        if(response.data['shape']){
                            this.shapes.coordinates = response.data['shape'].coordinates
                        }             

                        if(Object.keys(response.data['item']).length > 0) { this.defaultObject = true }                    
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
                            this.$store.commit('messages/setShow', true)
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
                            this.$store.commit('messages/setShow', true)
                        })
                        .catch(e => {
                            console.log('error update: ', e)
                        })
                }
            },
            saveObject(){

                let timeDate = this.fields.shapeId ? this.fields.shapeId : Date.parse(new Date());

                //console.log(this.house.sections.split(', '))
                console.log(this.defaultObject)

                let dataHouse = {
                    ProjectId: this.fields.ProjectId,
                    numHouse: this.$route.params.house_id,
                    floors: this.fields.floors,
                    sections: this.fields.sections,
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
                if (!this.defaultObject) {
                    HouseDataService.createShape(data)
                        .then(response => {
                            console.log(response)
                            this.$store.commit('messages/setShow', true)
                        })
                        .catch(e => {
                            console.log('error create: ', e)
                        })
                } else {
                    HouseDataService.update(data)
                        .then(response => {
                            console.log(response)
                            this.$store.commit('messages/setShow', true)
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
                this.scaleCanvas(this.scale)
                this.subcoordinates = []
                this.house = {
                    sections: '',
                    floors: '',
                }
                //this.shapes = {
                //    coordinates: []
                //}

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

</style>