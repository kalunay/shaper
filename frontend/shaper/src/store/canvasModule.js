export const canvasModule = {
    state: () => ({
        scale: 1,
        colorBrush: '#000',
        fields: {},
        subcoordinates: [],
        shapes: {}
    }),
    getters: {

    },
    mutations: {
        setScale(state, scale){
            state.scale = scale
        },
        setBrush(state, brush){
            state.colorBrush = brush
        },
        setFields(state, fields){
            state.fields = fields
        },
        setSubcoordinates(state, subcoordinates){
            state.subcoordinates = subcoordinates
        },
        setShapes(state, shapes){
            state.shapes = shapes
        }
    },
    actions: {
        async addImageOnCanvas({state, commit}) {
            let canvas = document.getElementById("myCanvas")
            canvas.width = state.fields.width
            canvas.height = state.fields.height
            let ctx = canvas.getContext('2d');
            console.log('addImageOnCanvas', state.fields.image)
            // Create our image
            let newImage = new Image();
            newImage.src = '/images/' + ((state.fields.image.name) ? state.fields.image.name : state.fields.image)
            newImage.width = state.fields.width
            newImage.height = state.fields.height

            // When it loads
            newImage.onload = () => {
                console.log(newImage)
                // Draw the image onto the context with cropping
                ctx.drawImage(newImage, 0, 0, state.fields.width, state.fields.height)
            }

            ctx.lineWidth = 2;
            ctx.strokeStyle = state.colorBrush
            //ctx.scale(this.scale, this.scale)
            let sc = state.scale
            let coord = []
            let ds = Math.ceil(state.fields.width / state.fields.height)
            canvas.onmouseup = function (event) {
                let x = event.offsetX
                let y = event.offsetY
                ctx.lineTo(x, y); //рисуем линию
                coord.push(Math.ceil((x / sc) / ds) + ',' + Math.ceil((y / sc) / ds))
                ctx.stroke()
            }

            canvas.ondblclick = (event) => {
                console.log(event)
                coord.pop()
                commit('setSubcoordinates', coord)
                coord = []
                ctx.closePath()
                ctx.beginPath()
            }

        }
    },
    namespaced: true
}