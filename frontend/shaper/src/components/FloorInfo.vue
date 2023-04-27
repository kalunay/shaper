<template>
    <div class="b-page-object">
        <BreadCrumbs :links="links"></BreadCrumbs>
        <h1>Этаж №{{ this.$route.params.floor_id }}, <i>Дом №{{ this.$route.params.house_id }}</i>, <i>{{ object.name }}</i></h1>

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
                            Добавление квартир на этаже №{{ this.$route.params.floor_id }}
                            <span class="glyphicon glyphicon-menu-down" id="addForm"></span>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label>ID квартир <i>([89101,89102,89103])</i></label>
                                <input class="form-control" v-model="this.shapes.itemsIds" type="text" required v-if="copyCheck == false">
                                <input class="form-control" v-model="this.fields.itemsIds" type="text" required v-else>
                            </div>
                            <div class="mb-3">
                                <label>Координаты</label><br>
                                <!-- <textarea class="form-control" v-model="shapes.coordinates" disabled rows="3"></textarea> -->
                                <div class="b-coordinates">{{ shapes.coordinates }}</div>
                            </div>                            
                            <button type="button" class="btn btn-dark w-50" @click="saveObject()">Сохранить</button>
                            <button type="button" class="btn btn-warning w-50" @click="clearObject()">Очистить</button>

                            <div class="mb-3 mt-3"><label>Копировать координаты этажа</label></div>
                            <div class="mb-3 d-flex">
                                <select class="form-control" v-model="indexFloor" @change="copyCheck = true">
                                    <option v-for="f,index in house.floors" :key="index" :value="f">{{ f }} этаж</option>
                                </select>
                                <button type="button" class="btn btn-danger" @click="copyFloor()">Копировать</button>                                
                            </div>

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
    import FloorDataService from '@/services/FloorDataService'
    export default {
        watch: {
            '$route.params': {
                handler(newValue) {
                    this.getObject(newValue.id)
                    this.getFloor()
                    this.addImageOnCanvas()
                },
                immediate: false,
            },
        },
        name: "FloorInfo",
        data(){
            return {
                links: [],
                object: {},
                fields: {
                    ProjectId: this.$route.params.id,
                    houseId: this.$route.params.house_id,
                    floorNum: this.$route.params.floor_id,
                    shapeId: 0,
                    image: '',
                    width: 0,
                    height: 0,
                    sameIds: [],
                    itemsIds: []

                },
                scale: 1,
                listScale: [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3],
                colorBrush: '#000',
                defaultObject: false,
                coordinits: [],
                svgPath: '',
                shapes: {
                    shapeId: '',
                    image: '',
                    width: 0,
                    height: 0,
                    coordinates: [],
                    itemsIds: []
                },
                subcoordinates: [],
                floors: [],
                house: {},
                delIndex: 0,
                indexFloor: 0,
                copyCheck: false
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
            handleFileUpload() {
                this.fields.image = this.$refs.file.files[0]
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

                if(this.fields.image){
                    FloorDataService.upload(formData)
                    .then(response => {
                        //return response
                        //this.fields.image = response.data[0].image.name
                        console.log(response)
                    })
                    .catch(e => {
                        console.log('error upload image: ', e)
                    })
                }


                //console.log(formData);

                // console.log('image: ', this.fields.image)

                let data = {
                    ProjectId: this.fields.ProjectId,
                    houseId: this.fields.houseId,
                    floorNum: this.fields.floorNum,
                    image: this.fields.image.name,
                    width: this.fields.width,
                    height: this.fields.height,
                    shapeId: this.fields.shapeId
                }

                console.log(data)

                //console.log('DATA: ', data)
                //console.log('default image: ', this.defaultObject)
                if (!this.defaultObject) {
                    FloorDataService.create(data)
                        .then(response => {
                            console.log(response)
                        })
                        .catch(e => {
                            console.log('error create: ', e)
                        })
                } else {
                    FloorDataService.update(data)
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
            getFloor() {
                FloorDataService.info(this.$route.params.id, this.$route.params.house_id, this.$route.params.floor_id)
                    .then(response => {
                        console.log('getFloor', response)
                        this.fields.image = response.data['item'].image
                        this.fields.width = response.data['item'].width
                        this.fields.height = response.data['item'].height
                        this.fields.shapeId = response.data['item'].shapeId  
                        this.fields.itemsIds = response.data['item'].itemsIds
                        
                        if(response.data['item'].itemsIds.length > 0){
                            this.copyCheck = true
                        }

                        if(response.data['shape']){
                            this.shapes.coordinates = response.data['shape'].coordinates
                            
                            //this.shapes.itemsIds = ((response.data['item'].itemsIds.length > 0) ? response.data['item'].itemsIds : response.data['shape'].itemsIds)

                            this.shapes.shapeId = response.data['shape'].shapeId
                            this.shapes.itemsIds = response.data['shape'].itemsIds
                        }

                        this.house = {...response.data['house']}

                        //console.log('length',Object.keys(response.data['item']).length)

                        if(Object.keys(response.data['item']).length > 0) { this.defaultObject = true }
                    })
                    .catch(e => {
                        console.log('error info: ', e)
                    })
            },
            saveObject(){

                let timeDate = this.fields.shapeId ? this.fields.shapeId : Date.parse(new Date());

                console.log(this.fields.shapeId)
                console.log(this.shapes.shapeId)

                // if (!this.defaultObject) {
                //     timeDate = Date.parse(new Date());
                // }

                //console.log(this.house.sections.split(', '))
                console.log(this.defaultObject)

                let dataFloor = {
                    ProjectId: this.fields.ProjectId,
                    houseId: this.$route.params.house_id,
                    floorNum: this.$route.params.floor_id,
                    shapeId: timeDate,
                    image: this.fields.image,
                    width: this.fields.width,
                    height: this.fields.height,          
                    itemsIds: ((this.fields.itemsIds.length > 0) ? this.fields.itemsIds.split(',') : [])
                }

                //console.log(this.shapes.itemsIds[0].split(','))

                let dataShape = {
                    shapeId: timeDate,
                    image: this.fields.image,
                    width: this.fields.width,
                    height: this.fields.height, 
                    coordinates: this.shapes.coordinates,
                    itemsIds: ((this.shapes.itemsIds.length > 0) ? this.shapes.itemsIds.split(',') : [])                
                }

                let data = {
                    dataFloor,
                    dataShape
                }

                //console.log(dataShape)
                if (!this.defaultObject) {
                    FloorDataService.createShape(data)
                        .then(response => {
                            console.log(response)
                        })
                        .catch(e => {
                            console.log('error create: ', e)
                        })
                } else {
                    FloorDataService.update(data)
                        .then(response => {
                            console.log(response)
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
                this.subcoordinates = []
                //this.scaleCanvas(this.scale)
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
                this.shapes.itemsIds = []
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
                            ctx.lineTo(coords[0] * 3, coords[1] * 3)
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

            },
            copyFloor(){
                console.log(this.indexFloor)
                this.copyCheck = true
                FloorDataService.info(this.$route.params.id, this.$route.params.house_id, this.indexFloor)
                    .then(response => {
                        console.log('copyFloor', response)   
                        // this.defaultObject = false
                        // this.fields.shapeId = response.data.item.shapeId    
                        
                        let data = {
                            ProjectId: this.fields.ProjectId,
                            houseId: this.fields.houseId,
                            floorNum: this.fields.floorNum,
                            sameIds: this.indexFloor,
                            image: response.data.item.image,
                            width: response.data.item.width,
                            height: response.data.item.height,
                            shapeId: response.data.item.shapeId,
                            itemsIds: this.fields.itemsIds
                        }

                        FloorDataService.create(data)
                        .then(response => {
                            console.log(response)
                        })
                        .catch(e => {
                            console.log('error create: ', e)
                        })                        

                    })
                    .catch(e => {
                        console.log('error info: ', e)
                    })                
            },
            onChangeCopy(value){
                console.log(value)
            }
        },
        beforeMount(){
            //this.getObject(this.$route.params.id)
        },
        mounted(){
            this.getObject(this.$route.params.id)
            this.getFloor()
            setTimeout(() => {
                this.addImageOnCanvas()
            }, 1000)

            const card = document.getElementById('addForm')
            card.addEventListener('click', function () {
                var navMenu = document.getElementById("main-content");
                navMenu.classList.toggle("hidden");
            })
        },
        beforeUpdate(){
            this.links = [
                {'header': this.object.name, 'path': `/object/${this.$route.params.id}`},
                {'header': `Дом №${this.$route.params.house_id}`, 'path': `/object/${this.$route.params.id}/house/${this.$route.params.house_id}`},
                {'header': `Этаж №${this.$route.params.floor_id}`, 'path': `/object/${this.$route.params.id}/house/${this.$route.params.house_id}/floor/${this.$route.params.floor_id}`}
            ]  
        },
        computed: {
            
        }
    }
</script>

<style>

</style>