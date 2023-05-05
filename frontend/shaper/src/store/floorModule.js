import FloorDataService from '@/services/FloorDataService'

export const floorModule = {
    state: () => ({
        id: 0,
        house_id: 0
    }),
    getters: {

    },
    mutations: {
        setId(state, id){
            state.id = id
        },
        setItem(state, item){
            state.item = item
        }
    },
    actions: {
        async copyFloor(){
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
        }
    },
    namespaced: true
}