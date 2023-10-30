const { YOUTUBE_API_KEY } = require('../config/config');
const axios = require('axios');

const getVideos = async(request) => {
    const result = await axios.get(`https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&q=${request}&part=snippet`);
        console.log(result)
        if(!result.data.items[0].id.channelId){
            return {status: 400, error: 'Такого каналу немає'};
        }
        const channId = result.data.items[0].id.channelId;
        const resultChannels = await axios.get(`https://youtube.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channId}&key=${YOUTUBE_API_KEY}`);
        const playlistId = resultChannels.data.items[0].contentDetails.relatedPlaylists.uploads;
        const resultVideos = await axios.get(`https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=25&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`);
        console.log(resultVideos.data);
        return {status: 200, payload: resultVideos.data.items};

};

module.exports.getVideos = getVideos;