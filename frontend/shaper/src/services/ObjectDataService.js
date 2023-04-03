import http from "../http-common"

class ObjectDataService {
    create(data){
        return http.post('/object', data)
    }
    upload(data){
        return http.post('/object/upload', 
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
}

export default new ObjectDataService()