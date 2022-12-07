const express = require('express')
const router = express.Router();
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
        res.status(200).json(user);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.post('/', async (req, res) => {

    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.put('/:UserId', async (req, res) => {

    try {
        const updatedUser = await User.updateOne({ _id: req.params.UserId,
        $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        } });
        res.status(200).json(updatedUser);
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

module.exports = router;