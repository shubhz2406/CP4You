const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    
    name:{
        type: String,
        required: true
    },
    members:[
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    description: {
        type: String
    }


}, {
    timestamps: true, // Place timestamps option here
    toJSON: { getters: true } // Place toJSON option here
});

module.exports = mongoose.model('Group', groupSchema);