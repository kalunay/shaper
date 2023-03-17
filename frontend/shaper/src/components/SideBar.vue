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
                    <li class="sidebar-item"
                    :class="{ 'active': isExactActive }"
                    >
                        <a class="sidebar-link show-submenu" :href="href">
                            <i class="align-middle" data-feather="home"></i> 
                            <span class="align-middle">{{ object.name }}</span>
                            <i class="align-middle" data-feather="chevron-down"></i>
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

            (function(){
                const btn = document.getElementsByClassName("show-submenu");

                btn.addEventListener("click", function () {
                    console.log(btn);
                });  
            })()          

        }
    }
</script>

<style scoped>
    .dropdown-toggle::after {
        float: right;
        margin-top: 5px;
    }
    .dropdown-toggle.show::after {
        transform: rotate(-135deg);
    }
    .sidebar-link, a.sidebar-link { 
        padding: .625rem;
    }
    .sidebar-link svg:last-child {
        float: right;
    }
</style>