const ytdl = require('@distube/ytdl-core');
const url = 'https://www.youtube.com/watch?v=5qap5aO4i9A';

console.log('Testing URL:', url);
ytdl.getInfo(url)
    .then(info => {
        console.log('Title:', info.videoDetails.title);
        const format = ytdl.chooseFormat(info.formats, { filter: 'audioonly' });
        console.log('Format found:', !!format);
        if (format) console.log('URL:', format.url.substring(0, 50) + '...');
    })
    .catch(err => {
        console.error('Error fetching info:', err.message);
    });
