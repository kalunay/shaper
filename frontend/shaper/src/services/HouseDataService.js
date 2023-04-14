import http from "../http-common"

class HouseDataService {
    create(data){
        return http.post('/house', data)
    }
    update(data){
        return http.post(`/house/update/${data.ProjectId}/${data.numHouse}`, data)
    }
    upload(data){
        return http.post('/house/upload/image', 
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }    
        )
    }
    info(ProjectId, house_id){
        return http.get(`/house/${ProjectId}/${house_id}`)
    }
    createShape(data){
        return http.post(`/house/createShape/`, data)
    }
}

export default new HouseDataService()