const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    },
    refreshToken: {
        type: String,
        default: '',
    },
    fullname: {
        type: String,
        default: '',
    },
    dateOfBirth: {
        type: Date,
        default: Date.now(),
    },
    address: {
        type: String,
        default: '',
    },
    avatar: {
        type: String,
        default: '',
    },
    rating: {
        type: Number,
        default: null,
    },
    certificates: {
        type: [Map],
        default: [],
    },
    liked: {
        type: [String],
        default: [],
    },
    //0: Học sinh
    //1: Giáo viên
    //2: Quản trị
    role: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: {
        createdAt: 'created_at'
    }
});

module.exports = mongoose.model('User', usersSchema);