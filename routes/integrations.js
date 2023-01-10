const express = require('express')
const router = express.Router();
const passport = require('passport');

const songs_url_base = (process.env.SONGS_HOST);

// POST like to song /api/v1/likes

router.post('/', async (req, res) => {
    try {
        passport.authenticate("jwt", { session: false })
        const response = await fetch(songs_url_base + 'api/v1/likes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${req.headers.authorization}`
          },
          body: JSON.stringify({
            songId: req.body.songId,
            userId: req.body.userId
          })
        });
        if (!response.ok) {
          res.status(response.status).json({ message: response.statusText });
        }else{
          const song = await response.json();
          res.status(201).json(JSON.stringify(song));     
        }
    } catch (err) {
        res.json({
            message: err
        });
    }
});

// DELETE like to song /api/v1/likes
router.delete('/:likeId', async (req, res) => {
  console.log("delete like");
    try {
        passport.authenticate("jwt", { session: false })
        if (!req.params.likeId) {
          res.status(400).json({ message: 'Missing likeId' });
        }
        console.log(req.body.likeId);
        const response = await fetch(songs_url_base + 'api/v1/likes/' + req.params.likeId, {
          method: 'DELETE',
          headers: {
            'Authorization': `${req.headers.authorization}`
          }
        });
        if (!response.ok) {
          res.status(response.status).json({ message: response.statusText });
        }else{
          const song = await response.json();
          res.status(response.status).json(JSON.stringify(song));     
        }
    } catch (err) {
        res.json({
            message: err
        });
    }
});

// GET all songs liked from a user
router.get('/all', async (req, res) => {
    try {
        const userId = req.query.userId;
        fetch(songs_url_base + 'api/v1/likes' + `?userId=${userId}`, {
            method: 'GET'
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 204 || response.status === 404) {
                return false;
            }else  {
                throw new Error('Unexpected response');
            }
        })
        .then(songs => {
          if(songs === false){
            res.status(204).json({ message: 'No songs liked' });
          }else{
            res.status(200).json(songs);
          }
        })
        .catch(error => {
            res.status(error.response ? error.response.status : 500).json({ message: error.message });
        });
    } catch (err) {
        res.json({
            message: err
        });
    }
});


module.exports = router;