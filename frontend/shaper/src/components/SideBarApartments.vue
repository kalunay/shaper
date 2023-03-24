<template>
    <slot>

        <ul class="nested" :id="`submenu${projectId}`">
            <li v-for="(section, indexS) in tree" :key="indexS">
                <a href="">Section #{{ indexS }}</a> <span class="caret"></span>
                <ul class="nested">
                    <li v-for="(floor, indexF) in tree[indexS]" :key="indexF">
                        <a href="">Floor #{{ indexF }}</a> <span class="caret"></span>
                        <ul class="nested">
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
            var toggler = document.getElementsByClassName("caret");
            var i;

            for (i = 0; i < toggler.length; i++) {
            toggler[i].addEventListener("click", function() {
                this.parentElement.querySelector(".nested").classList.toggle("active");
                this.classList.toggle("caret-down");
                console.log(this.parentElement)
            });
            }     
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
    ul, #myUL {
  list-style-type: none;
}

#myUL {
  margin: 0;
  padding: 0;
}

.caret {
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.caret::before {
  content: "\25B6";
  color: black;
  display: inline-block;
  margin-right: 6px;
}

.caret-down::before {
  -ms-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);  
}

.nested {
  display: none;
}

.active {
  display: block;
}
</style>