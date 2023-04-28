import { ref, computed } from "vue";

export default function useCanvas(){

    

    const addImageOnCanvas = computed(() => {
        let canvas = document.getElementById("myCanvas")
        canvas.width = this.fields.width
        canvas.height = this.fields.height
        let ctx = canvas.getContext('2d');

        let newImage = new Image();
        newImage.src = '/images/' + this.fields.image
        newImage.width = this.fields.width
        newImage.height = this.fields.height

        newImage.onload = () => {
            console.log(newImage)
            ctx.drawImage(newImage, 0, 0, this.fields.width, this.fields.height)
        }

        ctx.lineWidth = 2;
        ctx.strokeStyle = this.colorBrush
        let sc = this.scale
        let coord = []
        let ds = Math.ceil(this.fields.width / this.fields.height)
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
            this.subcoordinates = coord
            coord = []
            ctx.closePath()
            ctx.beginPath()

        }

    })

    return {
        addImageOnCanvas
    }
}