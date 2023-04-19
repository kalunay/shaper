const { model, Schema } = require('mongoose')

const schema = new Schema({
    ProjectId: {
        type: Number,
        default: 0,
        unique: true
    },
    shapeId: Number,
    numHouse: {
        type: Number,
        default: 0,
        unique: true
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