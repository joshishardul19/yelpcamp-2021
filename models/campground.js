const mongoose = require('mongoose')
const { campgroundSchema } = require('../schemas')
const Review = require('./review')
const Schema = mongoose.Schema

const opts = { toJSON: { virtuals: true } }


const imgSchema = new Schema({
    url: String,
    filename: String
})

imgSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

const campSchema = new Schema({
    title: String,
    price: Number,
    images: [imgSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts)



campSchema.virtual('properties.popUpText').get(function () {
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`
})

campSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

const Campground = mongoose.model('Campground', campSchema)

module.exports = Campground