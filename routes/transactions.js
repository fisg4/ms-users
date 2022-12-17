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
        // Utiliza el ID del usuario para identificar el usuario que deseas actualizar
        const updatedUser = await User.updateOne({ _id: req.params.UserId },
        // Establece los nuevos valores para los campos que deseas actualizar
        {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            }
        });
        res.status(200).json(updatedUser);
    } catch (err) {
        // print error in console
        console.log(err);
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
        const user = await User.findOne ({ email: req . body . email });
        if (user) {
            // const validPassword = await bcrypt.compare(req.body.password, user.password);
            const validPassword = req.body.password === user.password;
            if (validPassword) {
                res.status(200).json(user);
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