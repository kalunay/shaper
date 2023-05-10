import http from "../http-common"

class ApartmentsDataService {
    getAll(name){
        if(name !== undefined) {
            return http.get(`/apartments/list?ObjectCategory=${name}`)    
        }
        return http.get(`/apartments/list`)
    }
    get(id) {
        return http.get(`/apartments/object/${id}`)
    }
}

export default new ApartmentsDataService()