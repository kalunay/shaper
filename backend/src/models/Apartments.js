const { model, Schema } = require('mongoose')

const schema = new Schema({
    ObjectID: Number,
    SectionID: Number,
    ProjectId: Number,
    ProjectName: String,
    BuildingNumber: Number,
    Storey: Number,
    ObjectType: String,
    ObjectStatus: Boolean,
    NumberOfRooms: Number,
    TotalSquare: Number,
    RoomsSquare: String,
    KitchenSquare: Number,
    Price: Number,
    TotalPrice: Number,
    GarageType: String,
    SeaView: Boolean,
    LevelCount: Number,
    BuildingMaterial: String,
    District: String,
    LandAddress: String,
    EntranceNumber: Number,
    ObjectNumber: Number,
    ObjectCategory: String,
    IsStudio: Boolean,
    img: {
        type: String,
        default: ''
    },
    MetaTitle: {
        type: String,
        default: ''
    },
    MetaDescription: {
        type: String,
        default: ''
    },
    jkHouseId: Number,
    WindowsOverlook: String
});

module.exports = model('Apartments', schema);