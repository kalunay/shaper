<template>
    <div class="b-pop-coordinates" v-if="subcoordinates.length > 0">
        {{ subcoordinates }}
        <div class="editPopUp">
            <div>
                <input type="number" class="form-control form-contro-xs w-65" size="2" v-model="floorEdit">
                <button class="btn btn-primary" @click="editToCoordinates()">Сохранить</button>
            </div>
            <div>
                <button class="btn btn-info" @click="addToCoordinates()">Добавить</button>
            </div>
        </div>
    </div>   
</template>

<script>
    import { mapState, mapMutations } from 'vuex'
    export default {
        name: 'SubCoordinates',
        data(){
            return {
                floorEdit: 0
            }
        },
        methods: {
            ...mapMutations({
                setSubcoordinates: 'canvasTools/setSubcoordinates',
                setShapes: 'canvasTools/setShapes',
            }),
            addToCoordinates(){
                this.shapes.coordinates.push(this.subcoordinates)
                this.setSubcoordinates([])
            },
            editToCoordinates(){
                console.log(this.floorEdit)
                console.log(this.subcoordinates)
                this.shapes.coordinates[this.floorEdit] = this.subcoordinates
            },
        },
        computed: {
            ...mapState({
                subcoordinates: state => state.canvasTools.subcoordinates,
                shapes: state => state.canvasTools.shapes
            }),
        },
    }
</script>

<style scoped>
    .w-65 { width: 65px; padding: 5px 10px; }
</style>