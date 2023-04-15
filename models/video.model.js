const mongoose = require('mongoose');

const videosSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    videoSrc: {
        type: String,
        require: true,
    },
    peopleLike: {
        type: [Map],
        default: [],
    },
    peopleDislike: {
        type: [Map],
        default: [],
    },
    userCreated: {
        type: String,
        require: true,
    },
}, {
    timestamps: {
        createdAt: 'created_at'
    }
});

module.exports = mongoose.model('Video', videosSchema);