import ObjectsDataService from '@/services/ObjectsDataService'
import FloorDataService from '@/services/FloorDataService'

export const objectModule = {
    state: () => ({
        id: 0,
        item: {},
        data: {},
        service: {},
        status: false
    }),
    getters: {

    },
    mutations: {
        setId(state, id){
            state.id = id
        },
        setItem(state, item){
            state.item = item
        },
        setData(state, data){
            state.data = data
        },
        setService(state, service){
            state.service = service
        },
        setStatus(state, status){
            state.status = status
        }
    },
    actions: {
        async getObject({state, commit}){
            //console.log(id)
            ObjectsDataService.get(state.id)
            .then(response => {
                console.log('getObject1',response.data)
                commit('setItem', response.data)
            })
            .catch(e => {
                console.log(e)
            })             
        },
        
        async submitFile({state}){

            let services = {
                FloorDataService: FloorDataService
            }

            let formData = new FormData();
            formData.append('file', state.data.image);

            if(state.data.image){
                services[state.service].upload(formData)
                .then(response => {
                    console.log(response)
                })
                .catch(e => {
                    console.log('error upload image: ', e)
                })
            }

            let data = {
                ProjectId: state.data.ProjectId,
                houseId: state.data.houseId,
                floorNum: state.data.floorNum,
                image: state.data.image.name,
                width: state.data.width,
                height: state.data.height,
                shapeId: state.data.shapeId
            }

            //console.log('DATA: ', data)
            //console.log('default image: ', this.defaultObject)
            if (state.status == false) {
                services[state.service].create(data)
                    .then(response => {
                        console.log(response)
                    })
                    .catch(e => {
                        console.log('error create: ', e)
                    })
            } else {
                services[state.service].update(data)
                    .then(response => {
                        console.log('update: ', response)
                        state.item.image = response.data.image
                        this.addImageOnCanvas()
                    })
                    .catch(e => {
                        console.log('error update: ', e)
                    })
            }

            //console.log(this.fields.image)
        }
    },
    namespaced: true
}