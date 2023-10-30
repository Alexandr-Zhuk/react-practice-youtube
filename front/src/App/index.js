import './App.css';
import { Route, Routes } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import ProtectedRoute from '../components/ProtectedRoute';
import SearchVideo from '../containers/SearchVideo';
import Auth from '../containers/Auth';
import { setAccessToken, setGoogleAccessToken } from '../actions/auth';
import axios from 'axios';


function App() {

	const dispatch = useDispatch();
	const accessToken = useSelector((state) => state.auth.accessToken);
	const googleAccessToken = useSelector((state) => state.auth.googleAccessToken)
	
	const checkRefresh = async(accessToken) => {
		console.log('aaccessToken in checkRefresh', accessToken);
		const result = await axios.get('/auth/local/checkrefresh', { headers: {"Authorization" : `Bearer ${accessToken}`} });
		if(result.data.accessToken){
			console.log(result.data.accessToken)
			setAccessToken(result.data.accessToken, dispatch)
			return result.data.accessToken;
		}
		setAccessToken('', dispatch)
		return false;
	};

	const checkAccess = async(accessToken) => {	
		console.log('checkAccess-accessToken', accessToken);
		const accToken = accessToken.split('.');
		
		const decod = JSON.parse(atob(accToken[1]));	
		
		const dateTimestamp = Date.parse(decod.expire);
		
		if(Number(dateTimestamp) < Number(Date.now())){
			
			const res = await checkRefresh(accessToken);
			console.log('front-tokens', res);
			console.log('ziben');
			return true;
		}
	};

	const checkGoogleRefresh = async() => {
		const res = await axios.get('/auth/google/checkgooglerefresh');
		if(res.data.status === 200){
			console.log(res);
			setAccessToken(res.data.accessToken, dispatch);
		}
	};

	if(accessToken){
		checkAccess(accessToken);
	}else{
		checkGoogleRefresh();
	}
	

	return (
		<div className="App">
			<Routes>
				<Route element={<ProtectedRoute isAuth={accessToken} isAuth2={googleAccessToken}/>}>
					<Route path='/' element={<SearchVideo />} />
				</Route>
				
				<Route path='/auth' element={<Auth />} />
			</Routes>
			
		</div>
	);
}

export default App;
