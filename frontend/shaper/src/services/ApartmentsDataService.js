import http from "../http-common"

class ApartmentsDataService {
    getAll(){
        return http.get("objects")
    }
    get(id) {
        return http.get(`/apartments/object/${id}`)
    }
}

export default new ApartmentsDataService()