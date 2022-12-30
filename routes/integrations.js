const express = require('express')
const router = express.Router();

const songs_url_base = (process.env.SONGS_HOST);

// POST like to song /api/v1/likes

router.post('/', async (req, res) => {
    try {
        const song = await axios.post(songs_url_base + 'api/v1/likes', {
            songId: req.body.songId,
            userId: req.body.userId
        });
        res.status(201).json(song);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

// GET all songs liked from a user
router.get('/all', async (req, res) => {
    try {
        const song = await axios.get(songs_url_base + 'api/v1/likes', {
            params: {
                userId: req.query.userId
            }
        });
        res.status(200).json(song);
    } catch (err) {
        res.json({
            message: err
        });
    }
});


module.exports = router;