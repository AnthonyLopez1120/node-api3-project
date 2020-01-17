const express = require('express');

const users = require('./userDb')
const post = require('../posts/postDb')

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!
  users
    .insert(req.body)
    .then(newUser =>{
      res.status(201).json(newUser)
    })
    .catch(()=>{
      res.status(500).json({ errorMessage: "Error creating user" })
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  post
    .insert({ ...req.body, user_id: req.params.id })
    .then(post =>{
      res.status(201).json(post)
    })
    .catch(()=>{
      res.status(500).json({ errorMessage: "Error creating post" })
    })
});

router.get('/', (req, res) => {
  // do your magic!
  users
  .get()
  .then(userList =>{
    res.status(200).json(userList)
  })
  .catch(()=>{
    res.status(500).json({ errorMessage: "Error The user list could not be retrived" })
  })
});

router.get('/:id', validateUser, (req, res) => {
  // do your magic!
    req.user
    ? res.status(200).json(req.user)
    : res.status(500).json({
      message: "Error retriving user"
    })
});

router.get('/:id/posts', validateUser, (req, res) => {
  // do your magic!
  users
  .getUserPosts(req.params.id)
  .then(post=>{
    res.status(200).json(post)
  })
  .catch(()=>{
    res.status(500).json({ errorMessage: "Error retrieving user post" })
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  users
    .remove(req.params.id)
    then(user=>{
      res.status(200).json(user)
    })
    .catch(()=>{
      res.status(500).json({ errorMessage: "Error deleting user" })
    })
});

router.put('/:id', validateUser, (req, res) => {
  // do your magic!
  users
  .update(req.params.id, req.body)
  .then(user=>{
    res.status(200).json(user)
  })
  .catch(()=>{
    res.status(500).json({ errorMessage: "Error updating user" })
  })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  users
  .getById(req.params.id)
  .then(user=>{
    if (user){
      req.user = user;
      next()
    }else{
      res.status(400).json({ message: "invalid user id" })
    }
  })
  .catch(()=>{
    res.status(500).json({ message: "An error has occured" })
  })
}

function validateUser(req, res, next) {
  // do your magic!
  if(Object.entries(req.body).length === 0){
    res.status(400).json({ message: "Missing user data" })
  }else if(!req.body.name){
    res.status(400).json({ message: "Missing required name field"})
  }else{
    next()
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if(Object.entries(req.body).length === 0){
    res.status(400).json({ message: "missing post data" })
  }else if (!req.body.text){
    res.status(400).json({ message: "missing text field" })
  }else{
    next()
  }
}

module.exports = router;
