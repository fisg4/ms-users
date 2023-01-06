const express = require('express')
const router = express.Router();
const passport = require('passport');

const songs_url_base = (process.env.SONGS_HOST);

// POST like to song /api/v1/likes

router.post('/', async (req, res) => {
    try {
        passport.authenticate("jwt", { session: false }),
        fetch(songs_url_base + 'api/v1/likes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + req.headers.authorization.split(' ')[1]
            },
            body: JSON.stringify({
              songId: req.body.songId,
              userId: req.body.userId
            })
          })
          .then(response => {
            if (response.status === 201) {
              return response.json();
            } else if (response.status === 409) {
              throw new Error('Conflict: Duplicate');
            } else {
              throw new Error('Unexpected response');
            }
          })
          .then(song => {
            res.status(201).json(song);
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

// GET all songs liked from a user
router.get('/all', async (req, res) => {
    try {
        fetch(songs_url_base + 'api/v1/likes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            params: {
                userId: req.query.userId
            }
        })
        .then(response => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 204) {
                throw new Error('No content');
            }else  {
                throw new Error('Unexpected response');
            }
        })
        .then(songs => {
            res.status(200).json(songs);
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