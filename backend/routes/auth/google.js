const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const authController = require('../../controllers/authController');
const axios = require('axios');

const pathUp = path.join(__dirname + '/../../public/uploads');
const upload = multer({dest: pathUp});

const getGoogleUserInfo = async(access_token) => {
    const { data } = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    console.log(data); // { id, email, given_name, family_name }
    return data;
  };

const getAccessTokenFromCode = async(code) => {
    const { data } = await axios({
        url: `https://oauth2.googleapis.com/token`,
        method: 'post',
        data: {
            client_id: '273446868286-pbbkceukv4l6jfr0erk24u4adkc75829.apps.googleusercontent.com',
            client_secret: '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',
            redirect_uri: 'http://localhost:5000/auth/google/login',
            grant_type: 'authorization_code',
            code,
        },
    });
    console.log(data); // { access_token, expires_in, token_type, refresh_token }

    const userData = await getGoogleUserInfo(data.access_token);
    return userData;
};

// /auth/google/login
router.get('/login', async(req, res) => {
    const data = req.query;
    
    console.log('work')
    
    if (data.error) {
        console.log(`An error occurred: ${data.error}`);
    } else {
        console.log(`The code is: ${data.code}`);
    }

    const userDataGoogle = await getAccessTokenFromCode(data.code);

    const loginData = await authController.loginGoogle(userDataGoogle);
    console.log(loginData);

    res.cookie('refreshToken', loginData.payload.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}); 
    //res.json({status: 'ok'});   
    res.redirect('http://localhost:3000/auth');
});

// /auth/google/checkgooglerefresh
router.get('/checkgooglerefresh', async(req, res) => {
    if(req.cookies.refreshToken){
        const refreshToken = req.cookies.refreshToken;
        const result = await authController.checkGoogleRefresh(refreshToken);
        if(result.status === 401){
            res.json({status: 401})
        }else{
            res.cookie('refreshToken', result.payload.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true}); 
            res.json({status: 200, accessToken: result.payload.accessToken});
        }

    }else{
        console.log('Doesnt work');
        res.json({status: 401});
    }

    
    
});

///auth/local/logout
router.get('/logout', async(req, res) => {
    
});

module.exports = router;