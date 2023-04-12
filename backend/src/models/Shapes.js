const { model, Schema } = require('mongoose')

const schema= new Schema({
    image: {
        type: String,
        unique: true
    },
    width: {
        type: Number,
        default: 0
    },
    height: {
        type: Number,
        default: 0
    },
    coordinates: {
        type: Array,
        default: []
    },
    shapeId: Number,
    itemsIds: {
        type: Array,
        default: []
    }
})

module.exports = model('Shapes', schema)