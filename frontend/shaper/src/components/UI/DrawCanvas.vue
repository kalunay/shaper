<template>

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
            <div class="btn-group" role="group" v-if="fields.floors !== undefined">
                <router-link 
                    class="btn btn-light" 
                    v-for="index in fields.floors" 
                    :key="index"                                
                    :to="`/object/${this.fields.ProjectId}/house/${this.$route.params.house_id}/floor/${index}`"
                >Этаж #{{ index }}</router-link>
            </div>
            <div class="btn-group" role="group" v-if="fields.houses !== undefined">
                <router-link 
                    class="btn btn-light" 
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
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'

    export default {
        name: 'DrawCanvas',
        props: {
            fields: {},
            shapes: {}
        },
        data(){
            return {
                listScale: [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3],
                svgPath: '',
                colorBrush: '#000'
            }
        },
        watch: {
            'colorBrush': {
                handler(newValue) {
                    this.setBrush(newValue)
                    console.log(newValue)
                    this.addImageOnCanvas()
                },
                immediate: false,
            },
            'fields.image': {
                handler(newValue) {
                    this.addImageOnCanvas(newValue)
                },
                immediate: false,
            }
        },
        methods:{

            ...mapMutations({
                subcoordinates: 'canvasTools/setSubcoordinates',
                setShapes: 'canvasTools/setShapes',
                setFields: 'canvasTools/setFields',
                setBrush: 'canvasTools/setBrush'
            }),

            ...mapActions({
                addImageOnCanvas: 'canvasTools/addImageOnCanvas',
            }),

            clearCanvas() {
                let canvas = document.getElementById("myCanvas")
                let ctx = canvas.getContext('2d')
                ctx.clearRect(0, 0, this.attrs.width, this.attrs.height)
                this.addImageOnCanvas()
                this.subcoordinates([])
            },
            scaleCanvas(scale) {
                this.$store.commit('canvasTools/setScale', scale)
                this.attrs.width *= this.$store.state.canvasTools.scale
                this.attrs.height *= this.$store.state.canvasTools.scale
                this.addImageOnCanvas()
                console.log(this.attrs.width)
                console.log(this.attrs.height)
            },
            getPathSvg() {
                //return 'M ' + this.coordinits.join(" ") + ' Z'
                //return this.shapes.coordinates = this.coordinits
            },
            getSizeForSvg() {
                let ds = Math.ceil(this.attrs.width / this.attrs.height)
                return '0 0 ' + Math.ceil(this.attrs.width / ds) + ' ' + Math.ceil(this.attrs.height / ds)
            },         
            
            drawShapes(){
                //console.log(this.shapes.coordinates)
                let canvas = document.getElementById("myCanvas")
                let ctx = canvas.getContext('2d')

                let newImage = new Image();
                newImage.src = '/images/' + this.attrs.image
                newImage.width = this.attrs.width
                newImage.height = this.attrs.height

                // When it loads
                newImage.onload = () => {
                    ctx.drawImage(newImage, 0, 0, this.attrs.width, this.attrs.height)

                    ctx.lineWidth = 1
                    ctx.strokeStyle = this.colorBrush

                    this.shapes.coordinates.forEach(element => {
                        console.log(element)
                        ctx.beginPath()
                        element.forEach(elem => {
                            let coords = elem.split(',')
                            ctx.lineTo(coords[0] * 2, coords[1] * 2)
                            ctx.stroke()
                        });
                        ctx.closePath()
                    });                    
                }

            },

        },
        beforeCreate(){
            //console.log('beforeCreate', this.fields)
            // this.setFields(this.fields)
            // this.setShapes(this.shapes)
        },
        mounted(){
            setTimeout(() => {
                this.addImageOnCanvas()
            }, 1000)
            this.setFields(this.fields)
            this.setShapes(this.shapes)
        },
        computed: {
            ...mapState({
                attrs: state => state.canvasTools.fields,
                shapes: state => state.canvasTools.shapes,
                colorBrush: state => state.canvasTools.colorBrush
            }),
            ...mapGetters({
            })
        }
    }
</script>

<style>
</style>