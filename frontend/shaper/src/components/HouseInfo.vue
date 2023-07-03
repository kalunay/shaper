<template>
    <div class="b-page-object">
        <BreadCrumbs :links="links"></BreadCrumbs>
       <h1>Дом №{{ this.$route.params.house_id }}, <i>{{ this.item.name }}</i></h1>

       <sub-coordinates :floorEdit="floorEdit"></sub-coordinates>

        <div class="container">

            <div class="row b-main-content" id="main-content">

                <draw-canvas :fields="fields" :shapes="shapes"></draw-canvas>

                <div id="card">
                    <div class="card text-center">
                        <div class="card-header">
                            Добавление Дома №{{ this.$route.params.house_id }}
                            <span class="glyphicon glyphicon-menu-down" id="addForm"></span>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <upload-image :data="fields" :service="service"></upload-image>
                            </div>
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
                            <button type="button" class="btn btn-warning w-50" @click="clear()">Очистить</button>

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
    import HouseDataService from '@/services/HouseDataService'
    import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    import { clearObject, deleteForIndex, hideForm } from '@/utils'    
    export default {
        watch: {
            '$route.params': {
                handler(newValue) {
                    this.setId(newValue.id)
                    this.getObject()
                    this.fields.ProjectId = newValue.id
                    this.getHouse()
                    this.addImageOnCanvas()
                },
                immediate: false,
            },
            'fields.floors': {
                handler(newValue){
                    if(newValue != undefined){
                        this.fields.floors = (Array.isArray(newValue) ? newValue : newValue.split(','))
                    }
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
                delIndex: 0,
                service: 'HouseDataService'
            }
        },
        methods: {
            ...mapMutations({
                setId: 'object/setId',
                setStatus: 'object/setStatus',
                setShow: 'messages/setShow',
                setFields: 'canvasTools/setFields',
            }),
            ...mapActions({
                getObject: 'object/getObject',
                addImageOnCanvas: 'canvasTools/addImageOnCanvas',
            }),

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
            
            saveObject(){

                let timeDate = this.fields.shapeId ? this.fields.shapeId : Date.parse(new Date());

                if(this.fields.image != undefined){
                    let formData = new FormData();
                    formData.append('file', this.fields.image);
                    HouseDataService.upload(formData)
                    .then(response => {
                        console.log(response)
                        this.addImageOnCanvas()
                    })
                    .catch(e => {
                        console.log('error upload image: ', e)
                    })
                }  

                //console.log(this.house.sections.split(', '))
                console.log(this.defaultObject)

                let dataHouse = {
                    ProjectId: this.fields.ProjectId,
                    numHouse: this.$route.params.house_id,
                    floors: this.fields.floors,
                    sections: this.fields.sections,
                    shapeId: timeDate,
                    image: this.fields.image.name,
                    width: this.fields.width,
                    height: this.fields.height,               
                }

                let dataShape = {
                    shapeId: timeDate,
                    image: this.fields.image.name,
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
                            this.setShow(true)
                            this.addImageOnCanvas()
                        })
                        .catch(e => {
                            console.log('error create: ', e)
                        })
                } else {
                    HouseDataService.update(data)
                        .then(response => {
                            console.log(response)
                            this.setShow(true)
                            this.addImageOnCanvas()
                        })
                        .catch(e => {
                            console.log('error update1: ', e)
                        })
                }    

            },            
            clear(){
                return clearObject(this.shapes)
            },            
            deleteIndex(){
                return this.shapes.coordinates = deleteForIndex(this.delIndex, this.shapes.coordinates)
            },
        },
        beforeCreate(){

        },
        beforeUpdate(){
            this.links = [
                {'header': this.item.name, 'path': `/object/${this.$route.params.id}`},
                {'header': `Дом №${this.$route.params.house_id}`, 'path': `/object/${this.$route.params.id}/house/${this.$route.params.house_id}`}
            ]            
        },
        mounted(){
            this.getHouse()
            this.setId(this.$route.params.id)
            this.getObject()
            hideForm()
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

<style scoped>

</style>