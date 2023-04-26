const { model, Schema } = require('mongoose')

const schema = new Schema({
    ProjectId: {
        type: Number,
        default: 0
    },
    houseId: {
        type: Number,
        default: 0
    },
    floorNum: {
        type: Number,
        default: 0,
        unique: true
    },
    shapeId: Number,
    sameIds: Number,
    itemsIds: Array,
    image: String,
    width: {
        type: Number,
        default: 0
    },
    height: {
        type: Number,
        default: 0
    }
})

module.exports = model('Floors', schema)