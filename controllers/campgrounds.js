const Campground = require('../models/campground')
const { cloudinary } = require('../cloudinary')
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding')

const mbxToken = process.env.MAPBOX_TOKEN
const geoCoder = mbxGeoCoding({ accessToken: mbxToken })

module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createNewForm = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const newCamp = new Campground(req.body.campground)
    newCamp.geometry = geoData.body.features[0].geometry
    newCamp.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    newCamp.author = req.user._id
    await newCamp.save()
    console.log(newCamp)
    req.flash('success', 'SUCCESSFULLY ADDED A CAMP')
    res.redirect(`/campgrounds/${newCamp._id}`)
}

module.exports.showCampgrounds = async (req, res, next) => {
    const { id } = req.params
    const foundCamp = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!foundCamp) {
        req.flash('error', 'CANNOT FIND CAMPGROUND')
        return res.redirect('/campgrounds')
    }
    req.session.BackToShow = req.originalUrl
    res.render('campgrounds/show', { foundCamp })
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params
    const foundCamp = await Campground.findById(id)
    if (!foundCamp) {
        req.flash('error', 'CANNOT FIND CAMPGROUND')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { foundCamp })
}

module.exports.editCampground = async (req, res, next) => {
    const { id } = req.params
    const foundCamp = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true })
    const imgs = req.files.map(i => ({ url: i.path, filename: i.filename }))
    foundCamp.images.push(...imgs)
    await foundCamp.save()
    if (req.body.deleteImages) {
        for (let file of req.body.deleteImages) {
            await cloudinary.uploader.destroy(file)
        }
        await foundCamp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'SUCCESSFULLY UPDATED CAMP')
    res.redirect(`/campgrounds/${foundCamp._id}`)
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params
    const deleteCamp = await Campground.findByIdAndDelete(id)
    req.flash('success', 'SUCCESSFULLY DELETED CAMP')
    res.redirect('/campgrounds')
}