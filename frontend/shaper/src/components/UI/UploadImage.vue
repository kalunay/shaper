<template>
    <div class="col">
        <label>Фото</label>
        <input class="form-control form-control-lg" name="image" id="file" type="file" ref="file" @change="handleFileUpload()">
    </div>
</template>

<script>
    import { mapState, mapMutations, mapActions } from 'vuex'

    export default {
        name: 'UploadImage',
        props: {
            data: {},
            service: String
        },
        methods: {

            ...mapMutations({
                setFields: 'canvasTools/setFields',
                setData: 'object/setData',
                setService: 'object/setService',
            }),
            ...mapActions({
                addImageOnCanvas: 'canvasTools/addImageOnCanvas',
            }),

            handleFileUpload() {
                console.log(this.$refs.file.files[0])
                this.fields.image = this.$refs.file.files[0]
                let reader = new FileReader();
                let image = new Image()
                let width = 0
                let height = 0
                reader.readAsDataURL(this.$refs.file.files[0]);
                reader.onload = function (e) {
                    image.src = e.target.result;
                    image.onload = function () {
                        width = this.width
                        height = this.height
                    }
                }
                setTimeout(() => {
                    this.fields.width = width
                    this.fields.height = height
                }, 300)
            }, 
        },
        computed: {
            ...mapState({
                fields: state => state.canvasTools.fields,
                data: state => state.object.data,
                service: state => state.object.service
            }),
        },
        mounted(){
            this.setData(this.data)
            this.setService(this.service)
        }
    }
</script>

<style>

</style>