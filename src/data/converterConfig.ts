export const CONVERTER_TOOLS = {
    // Images
    'png-converter': { type: 'image', formats: ['png', 'jpg', 'webp', 'gif', 'bmp', 'tiff', 'ico', 'svg'] },
    'jpeg-jpg-converter': { type: 'image', formats: ['jpg', 'png', 'webp', 'gif', 'bmp'] },
    'webp-converter': { type: 'image', formats: ['webp', 'png', 'jpg', 'gif'] },
    'gif-converter': { type: 'image', formats: ['gif', 'mp4', 'webp', 'png'] },
    'svg-converter': { type: 'image', formats: ['svg', 'png', 'jpg', 'webp'] },
    'ico-icns-converter': { type: 'image', formats: ['ico', 'png', 'jpg'] },
    'heic-heif-converter': { type: 'image', formats: ['heic', 'jpg', 'png'] },
    'tiff-converter': { type: 'image', formats: ['tiff', 'jpg', 'png'] },
    'bmp-converter': { type: 'image', formats: ['bmp', 'jpg', 'png'] },
    'raw-photo-converter': { type: 'image', formats: ['jpg', 'png', 'tiff'] }, // RAW usually goes to JPG/TIFF
    'photoshop-gimp-converter': { type: 'image', formats: ['jpg', 'png'] },
    'vector-postscript-converter': { type: 'image', formats: ['pdf', 'png', 'svg', 'jpg'] },

    // Audio
    'mp3-mp2-mp1-converter': { type: 'audio', formats: ['mp3', 'wav', 'aac', 'ogg'] },
    'wav-converter': { type: 'audio', formats: ['wav', 'mp3', 'aac', 'flac'] },
    'flac-converter': { type: 'audio', formats: ['flac', 'mp3', 'wav', 'aac'] },
    'ogg-oga-opus-converter': { type: 'audio', formats: ['ogg', 'mp3', 'wav'] },
    'aac-alac-converter': { type: 'audio', formats: ['aac', 'mp3', 'wav'] },
    'm4a-m4b-converter': { type: 'audio', formats: ['m4a', 'mp3', 'wav'] },
    'wma-converter': { type: 'audio', formats: ['wma', 'mp3', 'wav'] },
    'aiff-converter': { type: 'audio', formats: ['aiff', 'mp3', 'wav'] },

    // Video
    'mp4-m4v-h264-converter': { type: 'video', formats: ['mp4', 'webm', 'gif', 'mp3'] },
    'mkv-converter': { type: 'video', formats: ['mkv', 'mp4', 'webm', 'avi'] },
    'webm-ogv-converter': { type: 'video', formats: ['webm', 'mp4', 'gif'] },
    'avi-divx-converter': { type: 'video', formats: ['avi', 'mp4', 'webm'] },
    'quicktime-converter': { type: 'video', formats: ['mov', 'mp4'] },
    'windows-media-converter': { type: 'video', formats: ['wmv', 'mp4'] },
    'mpeg-vob-converter': { type: 'video', formats: ['mpeg', 'mp4'] },

    // Documents (Handled separately usually, but mapped here)
    'word-converter': { type: 'document', formats: ['docx', 'pdf', 'txt'] },
    'markdown-converter': { type: 'document', formats: ['md', 'html', 'pdf'] },
    'pdf-converter': { type: 'document', formats: ['pdf', 'docx', 'jpg'] },
    'spreadsheet-data-converter': { type: 'document', formats: ['csv', 'json', 'xlsx'] }
};
