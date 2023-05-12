<template>
    <div class="b-page-object">
        <BreadCrumbs :links="links"></BreadCrumbs>
        <h1>Этаж №{{ this.$route.params.floor_id }}, <i>Дом №{{ this.$route.params.house_id }}</i>, <i>{{ this.item.name }}</i></h1>

        <sub-coordinates :floorEdit="floorEdit"></sub-coordinates>

        <div class="container">

            <div class="row b-main-content" id="main-content">                

                <draw-canvas :fields="fields" :shapes="shapes"></draw-canvas>

                <div id="card">
                    <div class="card text-center">
                        <div class="card-header"> 
                            Добавление квартир на этаже №{{ this.$route.params.floor_id }}
                            <span class="glyphicon glyphicon-menu-down" id="addForm"></span>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <upload-image :data="fields" :service="service"></upload-image>
                            </div>
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
                            <button type="button" class="btn btn-warning w-50" @click="clear()">Очистить</button>

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
                            Объект: <i>{{ this.item.name }}</i>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>

    </div>
</template>
    
<script>
    import FloorDataService from '@/services/FloorDataService'
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import { clearObject, deleteForIndex, hideForm } from '@/utils'  
    export default {
        watch: {
            '$route.params': {
                handler(newValue) {
                    this.setId(newValue.id)
                    this.getObject()
                    this.getFloor()
                    this.addImageOnCanvas()
                },
                immediate: false,
            },
            'shapes.itemsIds': {
                handler(newValue){
                    this.shapes.itemsIds = (Array.isArray(newValue) ? newValue : newValue.split(','))
                },
                immediate: false,
            },
            'fields.itemsIds': {
                handler(newValue){
                    if(newValue !== undefined){
                        this.fields.itemsIds = (Array.isArray(newValue) ? newValue : newValue.split(','))
                    }
                },
                immediate: false,
            }
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
                coordinits: [],
                defaultObject: false,
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
                copyCheck: true,
                service: 'FloorDataService'
            }
        },
        methods: {        
            ...mapMutations({
                setId: 'object/setId',
                setStatus: 'object/setStatus',
                setShow: 'messages/setShow'
            }),
            ...mapActions({
                getObject: 'object/getObject',
                addImageOnCanvas: 'canvasTools/addImageOnCanvas',
            }),
                    
            getFloor() {
                FloorDataService.info(this.$route.params.id, this.$route.params.house_id, this.$route.params.floor_id)
                    .then(response => {
                        console.log('getFloor', response)
                        this.fields.image = response.data['item'].image
                        this.fields.width = response.data['item'].width
                        this.fields.height = response.data['item'].height
                        this.fields.shapeId = response.data['item'].shapeId  
                        this.fields.itemsIds = response.data['item'].itemsIds

                        if(response.data['shape']){
                            this.shapes.coordinates = response.data['shape'].coordinates
                            this.shapes.shapeId = response.data['shape'].shapeId
                            this.shapes.itemsIds = response.data['shape'].itemsIds
                        }

                        this.house = response.data['house']

                        if(Object.keys(response.data['item']).length > 0) { this.defaultObject = true }
                    })
                    .catch(e => {
                        console.log('error info: ', e)
                    })
            },
            saveObject(){

                let timeDate = this.fields.shapeId ? this.fields.shapeId : Date.parse(new Date());

                if(!this.fields.image){
                    let formData = new FormData();
                    formData.append('file', this.fields.image);
                    FloorDataService.upload(formData)
                    .then(response => {
                        console.log(response)
                        this.addImageOnCanvas()
                    })
                    .catch(e => {
                        console.log('error upload image: ', e)
                    })
                }                

                let dataFloor = {
                    ProjectId: this.fields.ProjectId,
                    houseId: this.$route.params.house_id,
                    floorNum: this.$route.params.floor_id,
                    shapeId: timeDate,
                    image: this.fields.image.name,
                    width: this.fields.width,
                    height: this.fields.height,          
                    itemsIds: ((this.fields.itemsIds !== undefined) ? ((this.fields.itemsIds.length > 0) ? this.fields.itemsIds : []) : [])
                }

                let dataShape = {
                    shapeId: timeDate,
                    image: this.fields.image.name,
                    width: this.fields.width,
                    height: this.fields.height, 
                    coordinates: this.shapes.coordinates,
                    itemsIds: ((this.shapes.itemsIds.length > 0) ? this.shapes.itemsIds : [])                
                }

                let data = {
                    dataFloor,
                    dataShape
                }

                if (this.defaultObject == false) {
                    FloorDataService.createShape(data)
                        .then(response => {
                            console.log('createShape',response)
                            this.setShow(true)
                            this.addImageOnCanvas()
                            this.getFloor()
                        })
                        .catch(e => {
                            console.log('error create: ', e)
                        })
                } else {
                    FloorDataService.update(data)
                        .then(response => {
                            console.log(response)
                            this.setShow(true)
                            this.addImageOnCanvas()
                        })
                        .catch(e => {
                            console.log('error update: ', e)
                        })
                }    

            },
            clear(){
                return clearObject(this.shapes)
            },            
            deleteIndex(){
                return this.shapes.coordinates = deleteForIndex(this.delIndex, this.shapes.coordinates)
            },
            copyFloor(){
                FloorDataService.info(this.$route.params.id, this.$route.params.house_id, this.indexFloor)
                    .then(response => {
                        console.log('copyFloor', response)      
                        
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
                            this.setShow(true)
                        })
                        .catch(e => {
                            console.log('error create: ', e)
                        })                        

                    })
                    .catch(e => {
                        console.log('error info: ', e)
                    })                
            }
        },
        mounted(){
            this.getFloor()
            this.setId(this.$route.params.id)
            this.getObject()
            hideForm()
        },
        beforeUpdate(){
            this.links = [
                {'header': this.item.name, 'path': `/object/${this.$route.params.id}`},
                {'header': `Дом №${this.$route.params.house_id}`, 'path': `/object/${this.$route.params.id}/house/${this.$route.params.house_id}`},
                {'header': `Этаж №${this.$route.params.floor_id}`, 'path': `/object/${this.$route.params.id}/house/${this.$route.params.house_id}/floor/${this.$route.params.floor_id}`}
            ]  
        },
        computed: {
            ...mapState({
                item: state => state.object.item,
                id: state => state.object.id,
                status: state => state.object.status
            }),
            ...mapGetters({
            })
        }
    }
</script>

<style>

</style>