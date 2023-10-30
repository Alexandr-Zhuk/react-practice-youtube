import {
    GET_VIDEO_LIST,
    IS_LOADING_VIDEOS
} from '../reducers/types';

// action creators
const actionGetVideos = (videos) => ({
    type: GET_VIDEO_LIST,
    payload: { videos }
});

const setVideos = (videos, dispatch) => {
    const action = actionGetVideos(videos);
    
    dispatch(action);
}

const actionIsLoading = (isLoading) => ({
    type: IS_LOADING_VIDEOS,
    payload: { isLoading }
});

const setIsLoad = (isLoading, dispatch) => {
    const action = actionIsLoading(isLoading);
    dispatch(action);
}

export { setVideos, setIsLoad};
