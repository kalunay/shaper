const { Objects } = require('../models');

module.exports = {
    async get({params: {id}}, res){
        const item = await Objects.findById(id);
        return res.status(200).send(item);
    },
    async getAll(req, res){
        const items = await Objects.find();
        return res.status(200).send(items);
    }
};