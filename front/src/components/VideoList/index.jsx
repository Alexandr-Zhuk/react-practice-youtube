import OneVideo from '../OneVideo';
import styles from './videoList.module.css'
import { InfinitySpin } from 'react-loader-spinner'

import { useSelector } from 'react-redux';

function VideoList(){
    const videoData = useSelector((state)=> state.videos.videos);
    const isLoad = useSelector((state)=> state.videos.isLoading);
    
    console.log(isLoad);

    return(
        <div >
            {isLoad
                ?
                <div className={styles.center}>
                    <InfinitySpin 
                        width='200'
                        color="#4fa94d"
                    />
                </div>
                :
                <div>
                    
                    {videoData.length === 0
                        ?
                        <p className={styles.center}>Введіть назву каналу</p>
                        :
                        <>{videoData[0].error
                            ?
                            <p className={styles.center}>{videoData[0].error}</p>
                            :
                            <ul className={styles.video_list}>
                                {videoData.map(item => 
                                    <li className={styles.preview_video_container}>
                                        <OneVideo 
                                            title={item.snippet.title} 
                                            preview={item.snippet.thumbnails} 
                                            channel={item.snippet.channelTitle} 
                                            id={item.contentDetails.videoId} 
                                        />
                                    </li>
                                )}
                            </ul>
                            }
                            
                        </>
                    }
                </div>
                
            }
            
            
        </div>
    );
}
/*

*/
export default VideoList;