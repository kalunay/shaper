const { Apartments } = require('../models');

module.exports = {
    async getAll({query: name},res){
        let items = {}
        if(name){
            items = await Apartments.find(name);
        } else {
            items = await Apartments.find();
        }
        return res.status(200).send(items);
    },
    async getObject({params: ProjectId}, res){
        const item = await Apartments.find(ProjectId).sort( { ObjectNumber: 1 } );
        return res.status(200).send(item);
    }
};