import http from "../http-common"

class FloorDataService {
    create(data){
        return http.post('/floor', data)
    }
    update(data){
        return http.post(`/floor/update/${data.dataFloor.ProjectId}/${data.dataFloor.houseId}/${data.dataFloor.floorNum}`, data)
    }
    upload(data){
        return http.post('/floor/upload/image', 
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }    
        )
    }
    info(ProjectId, house_id, floor_id){
        return http.get(`/floor/${ProjectId}/${house_id}/${floor_id}`)
    }
    createShape(data){
        return http.post(`/floor/createShape/`, data)
    }
}

export default new FloorDataService()