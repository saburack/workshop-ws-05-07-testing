/* eslint-disable indent */
import axios from 'axios';
import { each } from 'async';

const API_URL = 'https://www.googleapis.com/youtube/v3/search';
const API_KEY = 'AIzaSyBFW-Vj-r2M0CsZPvK4URD8u8fo-Qh9lZw';
const STATISTICS_API_URL = 'https://www.googleapis.com/youtube/v3/videos';

export const viewCountByVideo = (videoId) => {
  const params = {
    key: API_KEY,
    id: videoId,
    part: 'statistics',
  };
  return new Promise((resolve, reject) => {
    axios.get(STATISTICS_API_URL, { params })
      .then((response) => {
        resolve(Number(response.data.items[0].statistics.viewCount));
      })
      .catch((error) => {
        console.log(`youtube statistics api error: ${error}`);
        reject(error);
      });
  });
};

// eslint-disable-next-line import/prefer-default-export
export const youtubeSearch = (term) => {
  const params = {
    key: API_KEY,
    q: term,
    type: 'video',
    part: 'snippet',
  };
  return new Promise((resolve, reject) => {
    axios.get(API_URL, { params })
      .then((response) => {
        let totalViewCounter = 0;
        each(response.data.items, (item, callback) => {
          viewCountByVideo(item.id.videoId).then((views) => {
            totalViewCounter += Number(views);
            callback();
          });
        },
          (err) => {
            resolve({
              all: response.data.items,
              totalViews: totalViewCounter,
            });
          });
      });
  });
};
