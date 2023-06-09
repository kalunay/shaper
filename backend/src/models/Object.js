const { model, Schema } = require('mongoose')

const schema= new Schema({
    ProjectId: {
        type: Number,
        default: 0,
        unique: true
    },
    image: {
        type: String
    },
    width: {
        type: Number,
        default: 0
    },
    height: {
        type: Number,
        default: 0
    },
    sections: {
        type: Array
    },
    shapeId: Number,
    houses: Array
})

module.exports = model('Object', schema)