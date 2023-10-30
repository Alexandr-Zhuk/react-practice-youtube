const authModel = require('../models/authModel');
const userModel = require('../models/userModel');
const config = require('../config/config');
const jwt = require('jsonwebtoken');

const generateTokens = (id, email) => {

    const payloadAccess = {
        id,
        email,
        expire: new Date(Date.now() + 1000*60*5)
    };

    const payloadRefresh = {
        id,
        email,
        expire: new Date(Date.now() + 1000*60*60*24*30)
    };

    const accessToken = jwt.sign(payloadAccess, config.SECRET_ACCESS_KEY, {expiresIn: '5m'});
    const refreshToken = jwt.sign(payloadRefresh, config.SECRET_REFRESH_KEY, {expiresIn: '30d'});

    return {accessToken, refreshToken};
};

const login = async (data) => {
    const user = await authModel.findOne({'authData.email': data.email});
    if(!user || user.authData.password !== data.password){
        return {status: 401};
    }

    const tokens = generateTokens(user.userId, data.email);
    await authModel.findByIdAndUpdate(user._id, {isAuth: true, refreshToken: tokens.refreshToken});
    console.log('login-refreshToken', tokens.refreshToken);
    return {status: 200, payload: tokens}
};

const registration = async(data) => {
    const isCandidate = await userModel.findOne({email: data.email});
    if(isCandidate){
        return {status: 401, message: 'User already exist'};
    }
    console.log('isCandidate', isCandidate);

    const userData = {
        email: data.email,
        profile: {}
    };

    const registeredUser = await userModel.create(userData);

    const tokens = generateTokens(registeredUser._id, data.email);

    const authData = {
        strategy: 'local',
        userId: registeredUser._id,
        authData: {email: data.email, password: data.password},
        refreshToken: tokens.refreshToken
    };

    const resultAuth = await authModel.create(authData);
    console.log('resultAuth', resultAuth);
    
    return {status: 200, payload: tokens};
};

const checkRefresh = async(accessToken, refreshToken) => {
    const accToken = accessToken.split('.');
    const arrAccessToken = JSON.parse(atob(accToken[1]));
    
    const user = await authModel.findOne({'authData.email': arrAccessToken.email});
    
    console.log('ziben-refreshToken', refreshToken);
    console.log('user-refreshToken', user.refreshToken);

    if(refreshToken === user.refreshToken){
        const tokens = generateTokens(user.userId, user.authData.email);
        console.log(tokens);
        await authModel.findByIdAndUpdate(user._id, {refreshToken: tokens.refreshToken});
        return {status: 200, tokens: tokens};
    }

    return {status: 401, message: 'FAIL'};
};

const loginGoogle = async(data) => {
    console.log(data.id)
    let user = await authModel.findOne({'authData.googleId': data.id});

    if(!user){
        user = await registrationGoogle(data);
    }

    const tokens = generateTokens(user.userId, data.email);
    
    await authModel.findByIdAndUpdate(user._id, {isAuth: true, refreshToken: tokens.refreshToken});
    console.log('refreshToken при авторизации через гугл', tokens.refreshToken);
    return {status: 200, payload: tokens}
};

const registrationGoogle = async(data) => {
    const userData = {
        email: data.email,
        profile: {
            name: data.given_name,
            surname: data.family_name
        }
    };
    const registeredUser = await userModel.create(userData);

    const authData = {
        strategy: 'google',
        userId: registeredUser._id,
        authData: {email: data.email, googleId: data.id}
    };

    return await authModel.create(authData);
};

const checkGoogleRefresh = async(refreshToken) => {
    
    const user = await authModel.findOne({refreshToken: refreshToken});
    if(!user){
        return {status: 401};
    }
    const tokens = generateTokens(user.userId, user.authData.email);
    console.log('рефрешТокен при обновлении рефреш через гугл', tokens.refreshToken)
    await authModel.findByIdAndUpdate(user._id, {refreshToken: tokens.refreshToken});
    
    return {status: 200, payload: tokens}

};

const logout = async(accessToken) => {
    const accToken = accessToken.split('.');
    const arrAccessToken = JSON.parse(atob(accToken[1]));
    console.log(arrAccessToken);
    const result = await authModel.findOneAndUpdate({userId: arrAccessToken.id}, {isAuth: false, refreshToken: ''});
    console.log(result)


};

module.exports.login = login;
module.exports.loginGoogle = loginGoogle;
module.exports.registration = registration;
module.exports.checkRefresh = checkRefresh;
module.exports.checkGoogleRefresh = checkGoogleRefresh;
module.exports.logout = logout;