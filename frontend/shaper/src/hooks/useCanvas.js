import { ref, onMounted } from "vue";

export default function useCanvas(fields){

    const colorBrush = ref('#000')
    const scale = ref(1)
    const subcoordinates = ref([])


    const addImageOnCanvas = async() => {
        console.log('11111')
        let canvas = document.getElementById("myCanvas")
        canvas.width = fields.width
        canvas.height = fields.height
        let ctx = canvas.getContext('2d');

        let newImage = new Image();
        newImage.src = '/images/' + fields.image
        newImage.width = fields.width
        newImage.height = fields.height

        newImage.onload = () => {
            console.log(newImage)
            ctx.drawImage(newImage, 0, 0, fields.width, fields.height)
        }

        ctx.lineWidth = 2;
        ctx.strokeStyle = colorBrush.value
        let sc = scale.value
        let coord = []
        let ds = Math.ceil(fields.width / fields.height)
        canvas.onmouseup = function (event) {
            let x = event.offsetX
            let y = event.offsetY
            ctx.lineTo(x, y);
            coord.push(Math.ceil((x / sc) / ds) + ',' + Math.ceil((y / sc) / ds))
            ctx.stroke()
        }

        canvas.ondblclick = (event) => {
            console.log(event)
            coord.pop()
            subcoordinates.value = coord
            coord = []
            ctx.closePath()
            ctx.beginPath()

        }

    }

    onMounted(addImageOnCanvas)

    return {
        colorBrush, scale, subcoordinates
    }
}