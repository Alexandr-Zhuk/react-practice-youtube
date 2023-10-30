const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const authController = require('../../controllers/authController');
const nodemailer = require('nodemailer');
const pathUp = path.join(__dirname + '/../../public/uploads');
const upload = multer({dest: pathUp});

/*
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'alexandrzhuk88@gmail.com',
        pass: 'prevatbank',
    },
});
*/



// /auth/local/login
router.post('/login', upload.none(), async(req, res) => {
    const data = req.body;

    //validation
    const result = await authController.login(data);
    if(result.status === 401){
        res.json({message: 'Wrong email or password'});
    }
    res.cookie('refreshToken', result.payload.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
    res.json({message: 'Successful login', accessToken: result.payload.accessToken});
});

// /auth/local/registration
router.post('/registration', upload.none(), async (req, res) => {
    const data = req.body;
    console.log(data);
    //validation
    const result = await authController.registration(data);
    if(result.status === 401){
        return res.status(200).json({message: 'User already exists'});
        
    }
    res.cookie('refreshToken', result.payload.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
    res.status(200).json({message: 'Successful registration'});
    
});

// /auth/local/checkrefresh
router.get('/checkrefresh', async(req, res) => {
    const authData = req.headers.authorization.split(' ');
    const accessToken = authData[1];
    const refreshToken = req.cookies.refreshToken;
    console.log('Receive accessToken', accessToken);
    console.log('Receive refreshToken', refreshToken);
    const result = await authController.checkRefresh(accessToken, refreshToken);
    
    if(result.status === 200){
        console.log('tokens', result.tokens);
        res.cookie('refreshToken', result.tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
        res.json({message: 'Successful', accessToken: result.tokens.accessToken});
    }
    if(result.status === 401){
        res.json({message: result.message});
    }
});

///auth/local/logout
router.get('/logout', async(req, res) => {
    const authData = req.headers.authorization.split(' ');
    const accessToken = authData[1];
    const result = await authController.logout(accessToken);
    res.clearCookie('refreshToken');
    res.json({message: 'Successfull LogOut'});
});

///auth/local/remember-password
router.get('/remember-password', async(req, res) => {
    
/*


*/
//let testEmailAccount = await nodemailer.createTestAccount();

let transporter = nodemailer.createTransport({
    host: 'mx1.mirohost.net',
    port: 25,
    secure: false,
    auth: {
        user: 'info@raravis.com.ua',
        pass: 'Rara951Avis',
    },
});

let result = await transporter.sendMail({
    from: `"Node js" <info@raravis.com.ua>`,
    to: 'lussystr@gmail.com',
    subject: 'Все читаете и читаете?',
    text: 'Хватит читать!',
    html:
        'Хватит <strong>читать</strong>!',
});

console.log(result);
res.json({status: 200});
});

module.exports = router;