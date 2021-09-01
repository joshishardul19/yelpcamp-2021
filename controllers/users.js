const User = require('../models/user')
const passport = require('passport')

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.createRegisterForm = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const user = new User({ email, username })
        const newUser = await User.register(user, password)
        req.login(newUser, (err) => {
            if (err) {
                return next()
            }
            req.flash('success', 'Welcome to YelpCamp')
            res.redirect('/campgrounds')
        })
    } catch (err) {
        req.flash('error', err.message)
        res.redirect('/register')
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login')
}

module.exports.authenticateLogin = (req, res) => {
    req.flash('success', 'Welcome back')
    if (req.session.BackToShow) {
        const BackToShow = req.session.BackToShow
        delete req.session.BackToShow
        return res.redirect(BackToShow)
    }
    const goBack = req.session.goBack || '/campgrounds'
    delete req.session.goBack
    res.redirect(goBack)
}

module.exports.logout = (req, res) => {
    req.logout()
    req.flash('success', 'GOODBYE!')
    res.redirect('/campgrounds')
}