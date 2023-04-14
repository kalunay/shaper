const { House } = require('../models')

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
    async update({ params: {ProjectId, house_id}, body }, res){
        const item = await House.findOneAndUpdate({ProjectId: ProjectId, numHouse: house_id}, body, {new: true})
        return res.status(200).send(item)
    },
    async getHouse(req, res){
        console.log(req.params.id)
        const item = await House.find({ProjectId: req.params.id, numHouse: req.params.house_id})
        return res.status(200).send(item)
    }
}