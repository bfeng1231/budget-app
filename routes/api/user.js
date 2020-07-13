const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const auth = require('../../middleware/auth')

const User = require('../../models/user');

// POST api/user/register
// register new user
router.post('/register', (req, res) => {
  const { email, username, password } = req.body

  if (!email || !username || !password)
    return res.status(400).json({msg: 'Please enter all fields'})
  
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    return res.status(400).json({msg: 'Please enter a valid email'})

  User.findOne ({email})
    .then(user => {
      if (user) 
        return res.status(400).json({msg: 'This email has already been used'})
      
      const newUser = new User ({
        email, username, password, budget: 1000, profile: 'https://bit.ly/3fY7E9p'
      });

      // Hash password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash;
          newUser.save()
            .then(user => {
              jwt.sign(
                {id: user.id}, 
                config.get('jwtSecret'), 
                {expiresIn: 3600}, 
                (err, token) => {
                  if (err) throw err
                  res.json({
                    token,
                    user: {
                      id: user.id,
                      username: user.username,
                      email: user.email,
                      budget: user.budget,
                      profile: user.profile
                    }
                  })
                }
              )
              
            })
        })
      })
    })  
})

// POST api/user/login
// validate user
router.post('/login', (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    return res.status(400).json({msg: 'Please enter all fields'})
  User.findOne ({email})
    .then(user => {
      if (!user) 
        return res.status(400).json({msg: 'User does not exist'})
      
      // Decrypt password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch)
            return res.status(400).json({msg: 'Invalid password'})
          jwt.sign(
            {id: user.id}, 
            config.get('jwtSecret'), 
            {expiresIn: 3600}, 
            (err, token) => {
              if (err) throw err
              res.json({
                token,
                user: {
                  id: user.id,
                  username: user.username,
                  email: user.email,
                  budget: user.budget,
                  profile: user.profile
                }
              })
              res.redirect('/home')
            }
          )
        })
    })  
})

// GET api/auth/user
// revalidate user
router.get('/', auth, (req, res) => {
  User.findById(req.user.id)
    .select('-password')
    .then(user => res.json(user))
})

// POST api/auth/user/budget
// change user's monthly budget
router.post('/budget', auth, (req, res) => {
  const { budget } = req.body

  if (isNaN(budget) || !budget)
    return res.status(400).json({msg: 'Please enter a number'})
  if (budget < 0)
    return res.status(400).json({msg: 'Please enter a positive number'})

  User.findByIdAndUpdate(req.user.id, {budget})
    .select('-password')
    .select('-expenses')
    .then(user => res.json(user))
})

// POST api/auth/user/profile
// change user's profile picture
router.post('/profile', auth, (req, res) => {
  const { profile } = req.body

  if (!profile)
    return res.status(400).json({msg: 'Please enter in the field'})

  User.findByIdAndUpdate(req.user.id, {profile})
    .select('-password')
    .select('-expenses')
    .then(user => res.json(user))
})

// POST api/auth/user/username
// change user's username
router.post('/username', auth, (req, res) => {
  const { username } = req.body

  if (!username)
    return res.status(400).json({msg: 'Please enter in the field'})

  User.findByIdAndUpdate(req.user.id, {username})
    .select('-password')
    .select('-expenses')
    .then(user => res.json(user))
})

// POST api/auth/user/email
// change user's email
router.post('/email', auth, (req, res) => {
  const { email } = req.body

  if (!email)
    return res.status(400).json({msg: 'Please enter in the field'})

  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
    return res.status(400).json({msg: 'Please enter a valid email'})

  User.findOne ({email})
    .then(user => {
      if (user) 
        return res.status(400).json({msg: 'This email has already been used'})
    })
    
  User.findByIdAndUpdate(req.user.id, {email})
    .select('-password')
    .select('-expenses')
    .then(user => res.json(user))
})

// POST api/auth/user/password
// change user's password
router.post('/password', auth, (req, res) => {
  const { password, newPassword } = req.body

  if (!password || !newPassword)
    return res.status(400).json({msg: 'Please enter all fields'})

  User.findById(req.user.id)
    .then(user => {
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch)
            return res.status(400).json({msg: 'Invalid password'})

          bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err
            bcrypt.hash(newPassword, salt, (err, hash) => {
              if (err) throw err
              User.findByIdAndUpdate(req.user.id, {password: hash})
                .select('-password')
                .select('-expenses')
                .then(user => res.json(user))                
            })
          })
        })
    })        
})
 
module.exports = router;