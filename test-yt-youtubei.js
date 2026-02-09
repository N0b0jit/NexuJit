const { Innertube } = require('youtubei.js');

async function test() {
    try {
        console.log('Creating Innertube instance...');
        const youtube = await Innertube.create();
        console.log('Fetching info...');
        const info = await youtube.getBasicInfo('5qap5aO4i9A');
        console.log('Title:', info.basic_info.title);
        const format = info.chooseFormat({ type: 'audio', quality: 'best' });
        console.log('Format found:', !!format);
    } catch (err) {
        console.error('Error:', err.message);
        console.error(err.stack);
    }
}

test();
