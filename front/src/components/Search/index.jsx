import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { sendSearchQuery } from '../../actions/searchQuery';
import { setVideos, setIsLoad } from '../../actions/videos';
import styles from './search.module.css';

function Search(){
    const [searchChannel, setSearchChannel] = useState();
    
    const dispatch = useDispatch();
    const getVideoS = async(channelName) => {
        setIsLoad(true, dispatch);
        const formData = new FormData();
        formData.append('request', channelName)
        const result = await axios.post('/youtube/search', formData);
        console.log(result);
        setVideos(result.data.payload, dispatch)
        setIsLoad(false, dispatch);
      };
    
    const btnSearchQuery = ()=>{
        sendSearchQuery(searchChannel, dispatch)
    }

    return(
        <div className={styles.search}>
            <input type="text" className={styles.search_input} onChange={(ev) => setSearchChannel(ev.target.value)}/>
            <button type="button" className={styles.search_button} onClick={()=> getVideoS(searchChannel)}>Пошук</button>
        </div>
    );
}

export default Search;