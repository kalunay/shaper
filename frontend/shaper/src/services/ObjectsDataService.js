import http from "../http-common"

class ObjectsDataService {
    getAll(){
        return http.get("objects")
    }
}

export default new ObjectsDataService()