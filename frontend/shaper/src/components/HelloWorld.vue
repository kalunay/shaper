<template>
		<div class="main">
			<nav class="navbar navbar-expand navbar-light navbar-bg">

				<div class="navbar-collapse collapse">
					<ul class="navbar-nav navbar-align">						
						<li class="nav-item dropdown">
							<a class="nav-icon dropdown-toggle d-inline-block d-sm-none" href="#" data-bs-toggle="dropdown">
                <i class="align-middle" data-feather="settings"></i>
              </a>

							<a class="nav-link dropdown-toggle d-none d-sm-inline-block" href="#" data-bs-toggle="dropdown">
                <img src="img/avatars/avatar.jpg" class="avatar img-fluid rounded me-1" alt="Charles Hall" /> <span class="text-dark">Charles Hall</span>
              </a>
							<div class="dropdown-menu dropdown-menu-end">
								<a class="dropdown-item" href="pages-profile.html"><i class="align-middle me-1" data-feather="user"></i> Profile</a>
								<a class="dropdown-item" href="#"><i class="align-middle me-1" data-feather="pie-chart"></i> Analytics</a>
								<div class="dropdown-divider"></div>
								<a class="dropdown-item" href="index.html"><i class="align-middle me-1" data-feather="settings"></i> Settings & Privacy</a>
								<a class="dropdown-item" href="#"><i class="align-middle me-1" data-feather="help-circle"></i> Help Center</a>
								<div class="dropdown-divider"></div>
								<a class="dropdown-item" href="#">Log out</a>
							</div>
						</li>
					</ul>
				</div>
			</nav>

			<main class="content">
				<div class="container-fluid p-0">

					<h1 class="h3 mb-3"><strong>Dashboard</strong></h1>

					<div class="row">
						<div class="col-xl-12 col-xxl-12 d-flex">
							<div class="w-100">
								<div class="row">
									<div class="col-4" v-for="item,index in statistics" :key="index">
										<div class="card">
											<div class="card-body">
												<div class="row">
													<div class="col mt-0">
														<h5 class="card-title">Общее число <i>{{ item.name }}</i></h5>
													</div>

													<div class="col-auto">
														<div class="stat text-primary">
															<i class="align-middle glyphicon glyphicon-home"></i>
														</div>
													</div>
												</div>
												<h1 class="mt-1 mb-3">{{ item.value }}</h1>
											</div>
										</div>
									</div>																	
								</div>
							</div>
						</div>
					</div>					

				</div>
			</main>

			<footer class="footer">
				<div class="container-fluid">
					<div class="row text-muted">
						<div class="col-6 text-start">
							<p class="mb-0">
								<a class="text-muted" href="https://adminkit.io/" target="_blank"><strong>AdminKit</strong></a> - <a class="text-muted" href="https://adminkit.io/" target="_blank"><strong>Bootstrap Admin Template</strong></a>								&copy;
							</p>
						</div>
						<div class="col-6 text-end">
							<ul class="list-inline">
								<li class="list-inline-item">
									<a class="text-muted" href="https://adminkit.io/" target="_blank">Support</a>
								</li>
								<li class="list-inline-item">
									<a class="text-muted" href="https://adminkit.io/" target="_blank">Help Center</a>
								</li>
								<li class="list-inline-item">
									<a class="text-muted" href="https://adminkit.io/" target="_blank">Privacy</a>
								</li>
								<li class="list-inline-item">
									<a class="text-muted" href="https://adminkit.io/" target="_blank">Terms</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</footer>
		</div>
</template>

<script>
import ObjectsDataService from '@/services/ObjectsDataService';
import ApartmentsDataService from '@/services/ApartmentsDataService';
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data(){
	return {
		count: 0,
		aparts: 0,
		apartments: 0,
		flats: 0,
		parking: 0,
		offices: 0,
		storerooms: 0,
		garageBox: 0,
		types: ['Апартаменты', 'Квартира', 'Офис', 'Хоз. помещение', 'Паркинг', 'Гаражный бокс'],
		statistics: {}
	}
  },
  methods:{
	allObjects(){
		ObjectsDataService.getAll()
		.then(response => {
			this.count = response.data.length
		})
		.catch(e => {
			console.log('error create: ', e)
		})  
	},
	allAparts(){
		ApartmentsDataService.getAll()
		.then(response => {
			this.aparts = response.data.length
		})
		.catch(e => {
			console.log('error create: ', e)
		}) 
	},
	getCount(name){
		ApartmentsDataService.getAll(name)
		.then(response => {
			console.log(response.data.length)
			this.count = response.data.length
		})
		.catch(e => {
			console.log('error create: ', e)
		})
	}
  },
  beforeMount(){
	for(let i = 0; i < this.types.length; i++){
		//console.log(this.types[i])
		ApartmentsDataService.getAll(this.types[i])
		.then(response => {
			//console.log(response.data.length)
			this.statistics[i] = {'name': this.types[i], 'value': response.data.length}
		})
		.catch(e => {
			console.log('error create: ', e)
		})
	}
  },
  mounted() {
	//console.log(this.statistics)
	//this.allObjects()
	//this.allAparts()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
