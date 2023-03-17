<template>
    <slot>

        <ul class="dropdown-sub-menu" :id="`submenu${projectId}`">
            <li v-for="(section, indexS) in tree" :key="indexS" class="dropdown">
                <a href="" role="button" class="sidebar-link" type="button" data-bs-toggle="collapse" :data-bs-target="`#dropdown-menu-floor-${indexS}`" aria-expanded="false" :aria-controls="`dropdown-menu-floor-${indexS}`">Section #{{ indexS }}</a>
                <ul class="dropdown-sub-menu collapse" :id="`dropdown-menu-floor-${indexS}`">
                    <li v-for="(floor, indexF) in tree[indexS]" :key="indexF" class="dropdown">
                        <a href="" class="sidebar-link" type="button" data-bs-toggle="collapse" :data-bs-target="`#dropdown-menu-flat-${indexS}-${indexF}`" aria-expanded="false" :aria-controls="`dropdown-menu-flat-${indexS}-${indexF}`">Floor #{{ indexF }}</a>
                        <ul class="dropdown-sub-menu collapse" :id="`dropdown-menu-flat-${indexS}-${indexF}`">
                            <li v-for="flat in tree[indexS][indexF]" :key="`${flat.ObjectID}`">
                                {{ flat.ObjectCategory }} #{{ flat.ObjectNumber }}
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>

    </slot>
</template>

<script>
    import ApartmentsDataService from '@/services/ApartmentsDataService';
    export default {
        name: 'SideBarApartaments',
        data() {
            return {
                apartments: [],
                tree: {},
            }
        },
        props: {
            projectId: Number
        },
        methods: {
            retrieveApartments () {
                ApartmentsDataService.get(this.projectId)
                .then(response => {
                    // получаем секции
                    const sections = [];
                    for(let i = 0; i <= response.data.length - 1; i++){
                        if(!sections.includes(response.data[i].SectionID)) {
                            sections.push(response.data[i].SectionID);  
                            this.tree[response.data[i].SectionID] = {}
                        }
                    }

                    // получаем этажи
                    const floors = [];
                    for(let i = 0; i <= response.data.length - 1; i++){
                        if(!floors.includes(response.data[i].Storey)) {
                        floors.push(response.data[i].Storey);  
                        }
                    }

                    // связываем секции -> этажи -> апартаменты
                    for(let i = 0; i <= sections.length - 1; i++){
                        for(let j = 0; j <= floors.length - 1; j++){
                            const odjects = response.data.filter(odject => (sections[i] === odject.SectionID && floors[j] === odject.Storey))
                            this.tree[sections[i]][floors[j]] = odjects
                        }        
                    }  
                    
                    // for(let section in this.tree){
                    //     console.log(section)
                    //     for(let floor in this.tree[section]){
                    //         console.log(floor)
                    //         for(let flat in this.tree[section][floor]){
                    //             console.log(this.tree[section][floor][flat].ObjectID);
                    //         }
                    //     }
                    // }
                    
                })
                .catch(e => {
                    console.log(e)
                })
            }
        },
        beforeMount(){
        },
        mounted(){
            this.retrieveApartments()
        }
    }
</script>

<style scoped>
    .dropdown-menu { 
        position: relative !important;
        background: transparent;
        padding: 0 20px;
        border: none;
    }
    ul.dropdown-sub-menu {
        display: none;
    }
    ul.dropdown-sub-menu.show {
        display: block;
    }
    ul li a {
        padding: 0;
    }
</style>