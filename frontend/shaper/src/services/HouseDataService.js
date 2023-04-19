import http from "../http-common"

class HouseDataService {
    create(data){
        return http.post('/house', data)
    }
    update(data){
        return http.post(`/house/update/${data.dataHouse.ProjectId}/${data.dataHouse.numHouse}`, data)
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
        console.log(data)
        return http.post(`/house/createshape/`, data)
    }
}

export default new HouseDataService()