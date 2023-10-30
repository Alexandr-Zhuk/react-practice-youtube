import styles from './oneVideo.module.css';

function OneVideo(props){
    const link = `https://www.youtube.com/watch?v=${props.id}`
    return(
        <div>
            <div className={styles.preview_container}>
                <a href={link} target='_blank'><img src={props.preview.medium.url} alt="" /></a>
            </div>
            <div className={styles.video_title}>
            <a href={link} target='_blank'>{props.title}</a>
            </div>
            <div className={styles.channel_name}>
                {props.channel}
            </div>
        </div>
    );
}

export default OneVideo;