const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.createReview = async (req, res, next) => {
    const { id } = req.params
    const foundCamp = await Campground.findById(id)
    const newReview = new Review(req.body.review)
    newReview.author = req.user._id
    foundCamp.reviews.push(newReview)
    await foundCamp.save()
    await newReview.save()
    req.flash('success', 'REVIEW ADDED')
    res.redirect(`/campgrounds/${foundCamp._id}`)
}

module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}