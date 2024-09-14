const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    handle: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    inGroups: [
        {
            type: Schema.Types.ObjectId,
            ref: "Group"
        }
    ],
    problemsSolved: [
        {
            type: Schema.Types.ObjectId,
            ref: "Problem"
        }
    ],
}, {
    timestamps: true, // Place timestamps option here
    toJSON: { getters: true } // Place toJSON option here
});

module.exports = mongoose.model('User', userSchema, 'users');
