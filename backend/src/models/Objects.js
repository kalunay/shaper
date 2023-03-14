const { model, Schema } = require('mongoose');

const schema = new Schema({
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Categories'
    },
    name: String,
    typeObject: String,
    address: String,
    coordinate: {
        w: Number,
        h: Number
    },
    commissioning: {
        quarter: Number,
        year: Number
    },
    ready: Number,
    mortgage: Number,
    priceFrom: Number,
    price: Number,
    typeOfPremises: String,
    href: String,
    title: String,
    logo: String,
    description: String,
    slider: Array,
    bkgImage: String,
    parking: Number,
    apartaments: Number,
    pantries: Number,
    MetaDesc: String,
    builds: Number,
    objectReady: Boolean,
    SecondDescription: String,
    projectDeclaration: Array,
    buildingPermit: Array,
    otherDocuments: Array,
    constructionProgress: Array,
    priority: Number,
    purchaseTerms: {
        type: Boolean,
        default: true
    },
    ProjectId: {
        type: Number,
        default: 0
    },
    MetaTitle: {
        type: String,
        default: ''
    },
    MetaDescription: {
        type: String,
        default: ''
    },
    jkId: Number,
    svgData: Array,
    showObject: {
        type: Boolean,
        default: true
    },
    ipotekaHref: {
        type: String,
        default: ''
    },
    ipotekaName: {
        type: String,
        default: 'Анкета на ипотеку в РНКБ'
    },
    showButtonReservation: {
        type: Boolean,
        default: true
    },
    showButtonBuyOnline: {
        type: Boolean,
        default: true
    },
    titleAboutObject: {
        type: String,
        default: ''
    }    
});

const Objects = model('_Objects', schema);  
module.exports = Objects;