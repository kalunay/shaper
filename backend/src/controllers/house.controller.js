const { House, Shapes } = require('../models')

module.exports = {
    async upload(req, res){
        req.files.file.mv('../frontend/shaper/public/images/' + req.files.file.name);
        console.log(req.files.file)
        return res.status(200).send(req.files.file)
    },
    async create({ body }, res){
        console.log('create house: ', body)
        const item = new House(body)
        const newItem = await item.save()
        return res.status(200).send(newItem)
    },
    async update({ params: {id, house_id}, body }, res){
        const dataShape = body.dataShape
        const dataHouse = body.dataHouse
        // console.log(dataShape)
        const item = await House.findOneAndUpdate({ProjectId: id, numHouse: house_id}, dataHouse, {new: true})
        //const shape = await Shapes.findOneAndUpdate({shapeId: dataShape.shapeId}, dataShape, {new: true})

        let shape = {}
        shape = await Shapes.findOne({shapeId: dataShape.shapeId})
        if(shape){
            shape = await Shapes.findOneAndUpdate({shapeId: dataShape.shapeId}, dataShape, {new: true})    
        } else {
            shape = new Shapes(dataShape)
            const newShape = await shape.save()
        }

        return res.status(200).send('OK')
    },
    async getHouse(req, res){
        console.log(req.params.id)
        const item = await House.findOne({ProjectId: req.params.id, numHouse: req.params.house_id})
        //const shape = await Shapes.findOne({shapeId: item.shapeId})

        let shape = {}
        if(item){
            shape = await Shapes.findOne({shapeId: item.shapeId}) 
        } else {
            item = {}
        }

        const newItem = {item,shape }
        return res.status(200).send(newItem)

        return res.status(200).send(item)
    },
    async createshape({ body }, res){
        //console.log(body.dataHouse.projectId)

        const dataShape = body.dataShape
        const dataHouse = body.dataHouse
        
        // const shape = new Shapes(dataShape)
        // const newShape = await shape.save()

        // const object = await House.findOneAndUpdate({ProjectId: body.dataHouse.projectId, numHouse: body.dataHouse.numHouse}, dataHouse, {new: true})

        let shape = {}
        shape = await Shapes.findOne({shapeId: dataShape.shapeId})
        if(shape){
            shape = await Shapes.findOneAndUpdate({shapeId: dataShape.shapeId}, dataShape, {new: true})    
        } else {
            shape = new Shapes(dataShape)
            const newShape = await shape.save()
        }

        let object = {}
        object = await House.findOne({ProjectId: body.dataHouse.ProjectId, numHouse: body.dataHouse.numHouse})

        console.log(object)

        if(object){
            object = await House.findOneAndUpdate({ProjectId: body.dataHouse.ProjectId, numHouse: body.dataHouse.numHouse}, dataHouse, {new: true})
        } else {
            const item = new House(dataHouse)
            const newItem = await item.save()
        }

        return res.status(200).send('OK')
    }
}