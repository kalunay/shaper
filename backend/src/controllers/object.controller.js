const { Object, Shapes } = require('../models');

module.exports = {
    async getInfo({ params: id }, res){
        let item = await Object.findOne({ProjectId: id.id});
        let shape = {}
        if(item){
            shape = await Shapes.findOne({shapeId: item.shapeId}) 
        } else {
            item = {}
        }
        const newItem = {item,shape }
        console.log(newItem)
        return res.status(200).send(newItem)
    },
    async get(req, res){
        return res.status(200).send('swdefibasdfikvgjkzabdfjkvbzjkdv')
    },
    async create({ body }, res){
        console.log(body)
        const item = new Object(body)
        const newItem = await item.save()
        return res.status(200).send(newItem)
    },
    async update({ params: {id}, body }, res){
        const item = await Object.findOneAndUpdate({ProjectId: id}, body, {new: true})
        return res.status(200).send(item)
    },
    async delete({ params: {id} }, res){
        await Object.findByIdAndDelete(id)
        return res.status(200).send({ status: 'Ok', message: 'Delete success' })
    },
    async upload(req, res){
        req.files.file.mv('../frontend/shaper/public/images/' + req.files.file.name);
        console.log(req.files.file)
        return res.status(200).send(req.files.file)
    },
    async createShape({ body }, res){
        //console.log(body.dataHouse.projectId)

        const dataShape = body.dataShape
        const dataHouse = body.dataHouse

        console.log(dataShape)
        console.log(dataHouse)
        
        // const shape = new Shapes(dataShape)
        // const newShape = await shape.save()

        let shape = {}
        shape = await Shapes.findOne({shapeId: dataShape.shapeId})
        if(shape){
            shape = await Shapes.findOneAndUpdate({shapeId: dataShape.shapeId}, dataShape, {new: true})    
        } else {
            shape = new Shapes(dataShape)
            const newShape = await shape.save()
        }

        let object = {}
        object = await Object.findOne({ProjectId: body.dataHouse.ProjectId})

        console.log(object)

        if(object){
            object = await Object.findOneAndUpdate({ProjectId: body.dataHouse.ProjectId}, dataHouse, {new: true})
        } else {
            const item = new Object(dataHouse)
            const newItem = await item.save()
        }

        return res.status(200).send('OK')
    },
}