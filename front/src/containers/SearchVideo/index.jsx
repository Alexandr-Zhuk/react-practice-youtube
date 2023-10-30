import Search from '../../components/Search';
import VideoList from '../../components/VideoList';
import styles from './searchVideo.module.css';

function SearchVideo(){

    

    return(
        <div className={styles.container}>
            <Search />
            <VideoList />
            
        </div>
    );
}

export default SearchVideo;