const { Floors, House, Shapes } = require('../models')

module.exports = {
    async upload(req, res){
        req.files.file.mv('../frontend/shaper/public/images/' + req.files.file.name);
        console.log(req.files.file)
        return res.status(200).send(req.files.file)
    },
    async create({ body }, res){
        console.log('create Floors: ', body)
        const item = new Floors(body)
        const newItem = await item.save()
        return res.status(200).send(newItem)
    },
    async update({ params: {id, house_id, floor_id}, body }, res){
        const dataShape = body.dataShape
        const dataFloor = body.dataFloor
        console.log(body)
        const item = await Floors.findOneAndUpdate({ProjectId: id, houseId: house_id, floorNum: floor_id}, dataFloor, {new: true})
        const shape = await Shapes.findOneAndUpdate({shapeId: dataShape.shapeId}, dataShape, {new: true})
        return res.status(200).send('OK')
    },
    async getFloor(req, res){
        console.log('getFloor', req.params)
        let item = await Floors.findOne({ProjectId: req.params.id, houseId: req.params.house_id, floorNum: req.params.floor_id})
        const house = await House.findOne({ProjectId: req.params.id, numHouse: req.params.house_id})
        let shape = {}
        if(item){
            console.log('true')
            shape = await Shapes.findOne({shapeId: item.shapeId})
        } else {
            console.log('false')
            shape = {
                coordinates: [],
                itemsIds: []
            }
            item = {}
        }

        console.log(shape)

        const newItem = { item, shape, house }
        return res.status(200).send(newItem)
    },
    async createshape({ body }, res){
        //console.log(body.dataHouse.projectId)

        const dataShape = body.dataShape
        const dataFloor = body.dataFloor
        
        const shape = new Shapes(dataShape)
        const newShape = await shape.save()

        const object = await Floors.findOneAndUpdate({ProjectId: body.dataFloor.ProjectId, houseId: body.dataFloor.houseId, floorNum: body.dataFloor.floorNum}, dataFloor, {new: true})

        return res.status(200).send('OK')
    }
}