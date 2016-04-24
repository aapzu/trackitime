"use strict";

var User = require('../models/user')
var bcrypt = require('bcrypt-nodejs')

module.exports = function(app, passport) {

    app.get('/profile/edit', function(req, res, next) {
        res.render('main.tmpl', {
            view: 'profile/profile-edit',
            title: "Edit Your Profile",
            data: {
                user: req.user
            }
        })
    })

    app.post('/profile/edit', function(req, res, next) {
        User.edit(req.body)
            .then(function(row) {
                req.flash('info', "Profile updated succesfully")
                res.redirect('back')
            })
            .catch(function(err) {
                req.flash('error', err.message)
                res.redirect('back')
            })
    })

    app.post('/profile/delete', function(req, res, next) {
        var errorHandler = function(err) {
            console.log(err)
            req.flash('error', err.message)
            res.redirect('/profile/edit')
        }
        User.findById(req.user.id)
            .then(function(user) {
                if(!user)
                    throw "No user found!"

                var id = user.id
                var password = req.body.password

                if (!bcrypt.compareSync(password, user.password)) {
                    req.flash('info', err.body)
                    res.reload()
                } else {
                    User.delete(id)
                        .then(function() {
                            req.flash('info', 'User ' + user.username + ' deleted succesfully')
                            req.session.destroy(function(err) {
                                console.error(err)
                            })
                            res.redirect('/logout')
                        })
                        .catch(errorHandler)
                }
            })
            .catch(errorHandler)

    })

    return this
}
