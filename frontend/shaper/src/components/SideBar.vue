<template>
    <nav id="sidebar" class="sidebar js-sidebar">
        <div class="sidebar-content js-simplebar">
            <a class="sidebar-brand" href="/">
                <span class="align-middle">Objects</span>
            </a>

            <ul class="sidebar-nav">
                
                <router-link 
                    custom                 
                    v-slot="{ href, isExactActive }"
                    v-for="object in objects"
                    :to="`/object/${object.ProjectId}`"
                    :key="`${object.ProjectId}`"
                >
                    <li class="sidebar-item "
                    :class="{ 'active': isExactActive }"
                    >
                        <a class="sidebar-link" :href="href">
                            <i class="align-middle" data-feather="sliders"></i> <span class="align-middle">{{ object.name }}</span>
                        </a>
                        <side-bar-apartments :projectId="object.ProjectId" />
                    </li>
                </router-link>

            </ul>
        </div>
    </nav>  
</template>

<script>
    import ObjectsDataService from '@/services/ObjectsDataService';
    import SideBarApartments from '@/components/SideBarApartments.vue';
    export default {
        name: 'SideBar',
        data() {
            return {
                objects: [],
            }
        },
        components: {
            SideBarApartments
        },
        methods: {
            retrieveObjects () { 
                ObjectsDataService.getAll()
                .then(response => {
                    this.objects = response.data
                })
                .catch(e => {
                    console.log(e)
                })
            },
        },
        mounted() {
            this.retrieveObjects();
        }
    }
</script>

<style scoped>

</style>