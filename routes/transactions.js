const express = require('express')
const router = express.Router();
const bcrypt = require("bcryptjs")

const User = require('../models/User');

router.get('/', async (req, res) => {

    try {
        const users = await User.find();
        res.status(200).json(users.map(user => user.cleanup()));
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.get('/:UserId', async (req, res) => {

    try {
        const user = await User.findById(req.params.UserId);
        res.status(200).json(user.cleanup());
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.post('/', async (req, res) => {
    email = req.body.email;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    } else {
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
            plan: req.body.plan 
        });
        
        try {
            const savedUser = await user.save();
            res.status(201).json(savedUser);
        } catch (err) {
            res.json({
                message: err
            });
        }
    }
});

router.put('/:UserId', async (req, res) => {
    try {
        email = req.body.email;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ error: 'Email already in use' });
        } else {
            if(req.body.password === undefined || req.body.password === null || req.body.password === "") {
                const updatedUser = await User.updateOne(
                    { _id: req.params.UserId },
                    
                    {
                      $set: {
                        username: req.body.username,
                        email: req.body.email,
                      }
                    }
                  );
                  res.status(201).json(updatedUser);
            } else {
                const password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
                const updatedUser = await User.updateOne(
                  { _id: req.params.UserId },
                  
                  {
                    $set: {
                      username: req.body.username,
                      email: req.body.email,
                      password: password
                    }
                  }
                );
                res.status(201).json(updatedUser);
            }
        }
    } catch (err) {
      res.json({
        message: err
      });
    }
  });

router.delete('/:UserId', async (req, res) => {

    try {
        const removedUser = await User.deleteOne({ _id: req.params.UserId });
        res.status(200).json(removedUser);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

// login post endpoint
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne ({ email: req.body.email });
        if (user) {
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            // const validPassword = req.body.password === user.password;
            if (validPassword) {
                res.status(200).json(user.cleanup());
            } else {
                res.status(400).json({ message: 'Invalid password' });
            }
        } else {
            res.status(400).json({ message: 'Invalid email' });
        }
    } catch (err) {
        res.json({
            message: err
        });
    }
});

module.exports = router;