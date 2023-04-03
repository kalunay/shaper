const { Object } = require('../models');

module.exports = {
    async getInfo({ params: id }, res){
        const item = await Object.find({ProjectId: id.id});
        console.log(item)
        return res.status(200).send(item)
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
        const item = Object.findByIdAndUpdate(id, body, {new: true});
        return res.status(200).send(item)
    },
    async delete({ params: {id} }, res){
        await Object.findByIdAndDelete(id)
        return res.status(200).send({ status: 'Ok', message: 'Delete success' })
    },
    async upload(req, res){
        req.files.file.mv('../frontend/shaper/public/images/' + req.files.file.name);
        return res.status(200)
        //console.log(req.files.file)
    }
}