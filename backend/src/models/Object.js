const { model, Schema } = require('mongoose')

const schema= new Schema({
    ProjestID: {
        type: Number,
        default: 0
    },
    image: {
        type: String
    },
    width: Number,
    height: Number,
    houses: Array
})

module.exports = model('Object', schema)