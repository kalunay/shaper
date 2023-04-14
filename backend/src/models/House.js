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
        type: String,
        default: ''
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
    }
})

module.exports = model('House', schema)