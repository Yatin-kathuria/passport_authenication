const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')

//User Model
const User = require('../models/User')

//Login page
router.get('/login', (req, res) => {
    res.render('login');
})

//Resgister page
router.get('/register', (req, res) => {
    res.render('register');
})

//Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //Check required fields
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'please fill in all  the fields' })
    }

    //Check password matchs
    if (password != password2) {
        errors.push({ msg: 'password do not match' })
    }

    //Check pass length
    if (password.length < 6) {
        errors.push({ msg: 'password should be at least 6 letters' })
    }

    if (errors.length > 0) {
        res.render('register', { errors, name, email, password, password2 });
    } else {
        // Validation Passed
        User.findOne({ email: email }).then(user => {
            if (user) {
                //Users exits
                errors.push({ msg: 'Email is already registerd' })
                res.render('register', { errors, name, email, password, password2 });
            } else {
                // const newUser = new User({ name: name, email: email, password: password }) same to next line
                const newUser = new User({ name, email, password })

                // hashed password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        //set password to hash
                        newUser.password = hash
                        // save user
                        newUser.save().then(user => {
                            req.flash('success_msg', 'You are now registered and you can log in');
                            res.redirect('/users/login')
                        }).catch(err => {
                            console.log(err)
                        })

                    })
                })
            }
        })
    }
})

//Login Handle
router.post('/login', (req, res,next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
})

//Logout Handle
router.get('/logout', (req,res)=>{
    req.logOut();
    req.flash('success_msg','You are logged out')
    res.redirect('/users/login')
})
module.exports = router;