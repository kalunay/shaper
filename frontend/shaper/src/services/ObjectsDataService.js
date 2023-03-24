import http from "../http-common"

class ObjectsDataService {
    get(id){
        return http.get(`/objects/${id}`)
    }
    getAll(){
        return http.get("objects")
    }
}

export default new ObjectsDataService()