import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setAccessToken } from '../../actions/auth';
import { useState } from 'react';
import { useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';
import Remember from './Remember';
import queryString from 'query-string';

function LoginRegister(){

    const dispatch = useDispatch();
    const accessToken = useSelector((state)=> state.auth.accessToken)
   
    const login = async(ev) => {
        ev.preventDefault();
        const formData = new FormData (ev.target.form);
        const data = await axios.post('/auth/local/login', formData);
        console.log(data);
        setAccessToken(data.data.accessToken, dispatch);
        
    };

    const registration = async(ev) => {
        ev.preventDefault();
        const formData = new FormData (ev.target.form);
        const data = await axios.post('/auth/local/registration', formData);
        console.log(data);
    };

    const logout = async() => {
        
        await axios.get('/auth/local/logout', { headers: { "Authorization": `Bearer ${accessToken}`} });
        setAccessToken('', dispatch);
    };

    const stringifiedParams = queryString.stringify({
        client_id: '273446868286-pbbkceukv4l6jfr0erk24u4adkc75829.apps.googleusercontent.com',
        
        redirect_uri: 'http://localhost:3000/auth',
        scope: [
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/userinfo.profile',
        ].join(' '), // space seperated string
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
    });

    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;
    const [showRemember, setShowRemember] = useState(false);
    const rememberPassword = async() => {
        setShowRemember(true);
        //await axios.get('/auth/local/remember-password');
    };

    const test = () => {
        const res = window.open(googleLoginUrl, 'google');
    }

    return (
        <>
        <NavLink to='/'>Home</NavLink>
        {
            !accessToken
            ? 
            <>
                <form>
                    <input type="text" name="email" placeholder="Ваш email.."/>
                    <br /><input type="password" name="password" placeholder="Ваш пароль.."/>
                    <br /><button type="button" onClick={login}>Авторизація</button>
                    <button type="button" onClick={registration}>Реєстрація</button>
                </form>
                <button type="button" onClick={rememberPassword}>Remember Password</button>
                {showRemember ? <Remember /> :  ''}
                <a href={googleLoginUrl}>Login with Google</a>  
                <button type="button" onClick={test}>googal</button>
            </>          
            :
                <div>
                    <button type="button" onClick={logout}>Вийти</button>
                </div>
            
        }
        </>
    )
}

export default LoginRegister;