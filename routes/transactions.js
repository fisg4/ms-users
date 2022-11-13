const express = require('express')
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {

    try {
        const Users = await User.find();
        res.status(200).json(Users);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.get('/:UserId', async (req, res) => {

    try {
        const User = await User.findById(req.params.UserId);
        res.status(200).json(User);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.post('/', async (req, res) => {

    const User = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const savedUser = await User.save();
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