const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');


const pathUp = path.join(__dirname + '/../../public/uploads');
const upload = multer({dest: pathUp});

const youtubeController = require('../../controllers/youtubeController');

router.post('/search', upload.none(), async(req, res) => {
    const searchRequest = req.body.request;
    
    const result = await youtubeController.getVideos(searchRequest);
    /*if(result.status === 400){
        return res.json({message: result.error});
    }*/
    res.json(result);
    
});

module.exports = router;