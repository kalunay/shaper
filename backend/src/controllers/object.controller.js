const { Object } = require('../models');

module.exports = {
    async get({ params: {id} }, res){
        const item = await Object.findById(id);
        return res.status(200).send(item)
    },
    async create({ body }, res){
        const item = new Object(body)
        const newItem = await item.save()
        return res.status(200).send(newItem)
    },
    async update({ params: {id}, body }, res){
        const item = Object.findByIdAndUpdate(id, body, {new: true});
        return res.status(200).send(item)
    },
    async delete({ params: {id} }, res){
        await Object.findByIdAndDelete(id)
        return res.status(200).send({ status: 'Ok', message: 'Delete success' })
    }
}