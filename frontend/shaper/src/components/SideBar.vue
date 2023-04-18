<template>
    <nav id="sidebar" class="sidebar js-sidebar">

        <div class="glyphicon glyphicon-chevron-left" id="hiddenMenu"></div>

        <div class="sidebar-content js-simplebar">

            <a class="sidebar-brand" href="/">
                <span class="align-middle">Objects</span>
            </a>

            <!-- <ul class="sidebar-nav" id="myUL">
                
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
                        </a>
                        <span class="caret"></span>
                        <side-bar-apartments :projectId="object.ProjectId" />
                    </li>
                </router-link>
            </ul>             -->

            <div id="treeview7" class=""></div>

        </div>
    </nav>
</template>

<script>
import ObjectsDataService from '@/services/ObjectsDataService';
//import SideBarApartments from '@/components/SideBarApartments.vue';
import ApartmentsDataService from '@/services/ApartmentsDataService';
import jquery from 'jquery';
import router from '../router/index'

window.$ = window.jQuery = require('jquery');

export default {
    name: 'SideBar',
    data() {
        return {
            objects: [],
            defaultData: [],
        }
    },
    components: {
        //SideBarApartments,
    },
    methods: {
        retrieveObjects() {
            ObjectsDataService.getAll()
                .then(response => {
                    this.objects = response.data

                    response.data.forEach(element => {
                        this.defaultData.push({
                            text: element.name,
                            tags: [element.ProjectId],
                            //href: '/object/' + element.ProjectId,
                            nodes: []
                        });

                        ApartmentsDataService.get(element.ProjectId)
                            .then(response => {
                                //console.log(response)

                                //let item = response.data.filter( item => item.text === element.name);

                                //строим секции
                                const sections = [];
                                for (let i = 0; i <= response.data.length - 1; i++) {
                                    if (!sections.includes(response.data[i].SectionID) && response.data[i].ProjectId === element.ProjectId) {
                                        sections.push(response.data[i].SectionID);
                                        let object = this.defaultData.filter(obj => obj.text === element.name)
                                        //console.log(object[0].nodes)

                                        //строим этажи
                                        const floors = [];
                                        let floorsObjects = [];
                                        for (let j = 0; j <= response.data.length - 1; j++) {
                                            if (!floors.includes(response.data[j].Storey) && response.data[j].ProjectId === element.ProjectId) {
                                                floors.push(response.data[j].Storey);

                                                let floorObjects = []
                                                const odjects = response.data.filter(odject => (response.data[i].SectionID === odject.SectionID && response.data[j].Storey === odject.Storey))
                                                //this.tree[sections[i]][floors[j]] = odjects
                                                odjects.forEach(elem => {
                                                    floorObjects.push({
                                                        text: 'Квартира №' + elem.ObjectNumber,
                                                        tags: [elem.ProjectId],
                                                        href: '/flat/' + elem.ProjectId + '/' + + elem.ObjectNumber,
                                                    })
                                                });

                                                let floorObjectsSorted = floorObjects.sort((a, b) => { return a['ObjectNumber'] > b['ObjectNumber'] ? 1 : -1 })
                                                //console.log(floorObjectsSorted)

                                                if (floorObjects.length > 0) {
                                                    floorsObjects.push({
                                                        text: 'Этаж №' + response.data[j].Storey,
                                                        tags: [],
                                                        nodes: floorObjectsSorted
                                                    })
                                                }

                                                floorObjects = []
                                            }
                                        }

                                        if (floorsObjects.length > 0) {
                                            object[0].nodes.push({
                                                text: 'Секция №' + response.data[i].SectionID,
                                                tags: [],
                                                nodes: floorsObjects
                                            })
                                        }

                                        floorsObjects = []
                                    }
                                }
                                //console.log(this.defaultData);

                            }).catch((e) => {
                                console.log(e)
                            });

                    });

                })
                .catch(e => {
                    console.log(e)
                })
        },
    },
    beforeMount() {
        let rs = document.createElement('script')
        rs.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-treeview/1.2.0/bootstrap-treeview.min.js')
        document.head.appendChild(rs)
    },
    mounted() {
        this.retrieveObjects();

        const MENU_TREE = this.defaultData
        setTimeout(function () {
            jquery('#treeview7').treeview({
                color: "#428bca",
                showBorder: false,
                data: MENU_TREE,
                levels: 1,
                backColor: 'transparent',
                enableLinks: true,
                onNodeSelected: function (event, data) {
                    router.push({ path: '/object/' + data.tags[0] })
                }
            });
        }, 1500);

        const button = document.getElementById('hiddenMenu')

        button.addEventListener('click', function () {
            var navMenu = document.getElementById("sidebar");
            navMenu.classList.toggle("hide");
        })

    },
}
</script>

<style>
.sidebar-link,
a.sidebar-link {
    padding: .625rem;
}

.sidebar-link svg:last-child {
    float: right;
}

#treeview7 {
    background: transparent;
    width: 100%;
    padding: 10px;
    color: #e9ecef;
}

.node-treeview7 {
    color: #e9ecef !important;
}

#treeview7 ul {
    background: transparent;
}

.treeview span.indent {
    margin-left: 5px;
    margin-right: 5px;
}

.sidebar {
    width: auto;
    padding: 0;
}

.list-group-item {
    background-color: transparent !important;
    border: none !important;
}

.list-group-item:hover {
    background-color: transparent !important;
    color: rgba(233, 236, 239, .5) !important;
}

.list-group-item.node-selected {
    color: #518be1 !important;
}

nav#sidebar {
    /*height: 100vh;
    overflow-y: scroll;*/
    z-index: 999999;
    position: relative;
    left: 0;
}

nav#sidebar.hide {
    position: absolute !important;
    left: -260px;
    transition: 1s;
    animation: show 3s 1;
    animation-fill-mode: forwards;
    animation-delay: 1s;
}

#sidebar #hiddenMenu::before { content: "\e079"; }
#sidebar #hiddenMenu {
    font-family: "Glyphicons Halflings";
    width: 32px;
    height: 32px;
    position: absolute;
    background: #222e3c;
    top: 0;
    left: 260px;
    color: #fff;
    text-align: center;
    line-height: 32px;
    border-radius: 0 10px 10px 0;
}
#sidebar.hide #hiddenMenu::before { content: "\e080"; }
#sidebar.hide #hiddenMenu {
    position: fixed;
    left: 0;
    background: #222e3c;
    top: 0;
    transition: 1s;
    animation: show 3s 1;
    animation-fill-mode: forwards;
    animation-delay: 1s;    
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  background: #222e3c;
  overflow-y: scroll;
  height: 100vh;
}

</style>