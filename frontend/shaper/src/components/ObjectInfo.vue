<template>
    <div>
        <pre>{{ object }}</pre>
    </div>
</template>

<script>
import ObjectsDataService from '@/services/ObjectsDataService';
export default {
  watch: {
    route (newValue, oldValue) { 
        console.log(oldValue)
        return this.$route.push({id: newValue});
    },
  },

    name: "ObjectInfo",
    data(){
        return {
            object: null,
        }
    },
    methods: {
        getObject(id){
            ObjectsDataService.get(id)
            .then(response => {
                this.object = response.data
            })
            .catch(e => {
                console.log(e)
            })
        }
    },
    mounted(){
        this.getObject(this.$route.params.id)
    },

}
</script>

<style>
</style>