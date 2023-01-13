const express = require('express')
const router = express.Router();
const bcrypt = require("bcryptjs")
const axios = require("axios");

const User = require('../models/User');
const { json } = require('body-parser');

const badwordfilter = 'https://community-purgomalum.p.rapidapi.com/json';
const xrapidapihost = 'community-purgomalum.p.rapidapi.com';
const xrapidkey = '4ac446483cmsh72be9fe1b3a03f1p15c2dejsn63485dda4b87';

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

    try {

        const options = {
            method: 'GET',
            url: badwordfilter,
            params: {text: "" + req.body.username + ", " + req.body.email + ""},
            headers: {
              'X-RapidAPI-Key': xrapidkey,
              'X-RapidAPI-Host': xrapidapihost
            }
          };
          
          axios.request(options).then(async function (response) {
              if (JSON.stringify(response.data).includes("*")) {
                    res.status(401).json({ error: 'Bad words detected' });
              } else {
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
            }
          }).catch(function (error) {
              console.error(error);
          });
    

    } catch (err) {
        res.status(400).json({ error: 'Quota reached' });
    }


});

router.put('/:UserId', async (req, res) => {
    try {
        const options = {
            method: 'GET',
            url: badwordfilter,
            params: {text: "" + req.body.username + ", " + req.body.email + ""},
            headers: {
              'X-RapidAPI-Key': xrapidkey,
              'X-RapidAPI-Host': xrapidapihost
            }
          };
          
          axios.request(options).then(async function (response) {
            if (JSON.stringify(response.data).includes("*")) {
                res.status(401).json({ error: 'Bad words detected' });
          } else {
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
          }
          }).catch(function (error) {
            console.error(error);
        });
    } catch (err) {
        res.status(400).json({ error: 'Quota reached' });
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