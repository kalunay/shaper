import http from "../http-common"

class ObjectDataService {
    create(data){
        return http.post('/object', data)
    }
    update(data){
        return http.post(`/object/update/${data.ProjectId}`, data)
    }
    upload(data){
        return http.post('/object/upload/image', 
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }    
        )
    }
    info(ProjectId){
        return http.get(`/object/${ProjectId}`)
    }
    createShape(data){
        return http.post(`/object/createShape/`, data)
    }
}

export default new ObjectDataService()