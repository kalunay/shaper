<template>
    <div class="b-page-object">
        <BreadCrumbs :links="links"></BreadCrumbs>

        <h1>{{ item.name }}</h1>

        <sub-coordinates :floorEdit="floorEdit"></sub-coordinates>

        <div class="container">

            <div class="row b-main-content" id="main-content">
                <draw-canvas :fields="fields" :shapes="shapes"></draw-canvas>

                <div id="card">

                    <div class="card text-center">
                        <div class="card-header">
                            Добавление дома
                            <span class="glyphicon glyphicon-menu-down" id="addForm"></span>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <upload-image :data="fields" :service="service"></upload-image>
                            </div>                            
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
                            <button type="button" class="btn btn-success w-50" @click="saveObject()">Сохранить</button>
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
                            Объект: <i>{{ item.name }}</i>
                        </div>
                    </div>

                </div>
            </div>

        </div>

    </div>
</template>

<script>
//import ObjectsDataService from '@/services/ObjectsDataService';
import ObjectDataService from '@/services/ObjectDataService';
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { clearObject, deleteForIndex, hideForm } from '@/utils' 

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
            btnColors: ['btn-primary', 'btn-secondary', 'btn-success', 'btn-danger', 'btn-warning', 'btn-info', 'btn-dark'],
            service: 'ObjectsDataService'
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

        saveObject(){

            let timeDate = this.fields.shapeId ? this.fields.shapeId : Date.parse(new Date());

            let formData = new FormData();
            formData.append('file', this.fields.image);

            if(this.fields.image){
                ObjectDataService.upload(formData)
                .then(response => {
                    console.log(response)
                })
                .catch(e => {
                    console.log('error upload image: ', e)
                })
            } 

            //console.log(this.house.sections.split(', '))

            let dataHouse = {
                projectId: this.house.projectId,
                houses: (Array.isArray(this.house.houses) ? this.house.houses : this.house.houses.split(',')),
                sections: (Array.isArray(this.house.sections) ? this.house.sections : this.house.sections.split(',')),
                shapeId: timeDate,
                image: this.fields.image.name,
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
                    this.setShow(true)
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
        clear(){
            return clearObject(this.shapes)
        },            
        deleteIndex(){
            return this.shapes.coordinates = deleteForIndex(this.delIndex, this.shapes.coordinates)
        },
    },
    beforeMount(){
        this.getObject(this.$route.params.id)
    },
    mounted() {
        console.log(this.$route.params.id)
        this.setId(this.$route.params.id)
        this.getObject()
        hideForm()
        this.fields.ProjectId = this.$route.params.id
        this.house.projectId = this.$route.params.id
        this.infoObject()
    },
    beforeUpdate(){
        this.links = [
            {'header': this.item.name, 'path': `/object/${this.$route.params.id}`}
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