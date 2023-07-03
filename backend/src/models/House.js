const { model, Schema } = require('mongoose')

const schema = new Schema({
    ProjectId: {
        type: Number,
        default: 0
    },
    shapeId: Number,
    numHouse: {
        type: Number,
        default: 0
    },
    sections: {
        type: Array
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
    floors: Array
})

module.exports = model('House', schema)