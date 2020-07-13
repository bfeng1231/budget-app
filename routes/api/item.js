const express = require('express')
const router = express.Router();
const auth = require('../../middleware/auth')

// Item model
const Item = require('../../models/item');
const User = require('../../models/user');

// GET api/items
// gets all items
router.get('/', auth, (req, res) => {
  //Item.find()
    //.sort({ date: -1 })
    //.then(items => res.json(items))
  User.findById(req.user.id)
    //.select('-password')
    .then(user => res.json(user.expenses))
})

// POST api/items
// post a single item
router.post('/', auth, (req, res) => {
  const newItem = new Item ({
    name: req.body.name,
    desc: req.body.desc,
    cost: req.body.cost,
    date: req.body.date,
    uid: req.body.uid
  })
  //newItem.save()
    //.then(item => res.json(item))
  User.findOneAndUpdate({_id: req.user.id}, {$push: {expenses: newItem}})
    .then(user => res.json(user.expenses))
})

// DELETE api/items/:id
// removes a single item
router.delete('/:id', auth, (req, res) => {
  User.findByIdAndUpdate(req.user.id, {$pull: {expenses: {uid: req.params.id}}})
    .then(user => res.json(user.expenses))
    .catch(err => res.status(404).json({msg: 'Item does not exist'}))

  //Item.findById(req.params.id)
    //.then(item => item.remove()
      //.then(() => res.json({success: true}))
    //)
    //.catch(err => res.status(404).json({success: false}))
})

module.exports = router;