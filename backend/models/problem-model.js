const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const problemApproachSchema = new Schema({
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }

});

const problemSchema = new Schema({
    
    problemName: {
        type: String,
        required: true
    },
    contestId: {
        type: String,
        required: true
    },
    index: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
    },
    approaches: {
        type: [problemApproachSchema]
    }
    
    

}, {
    timestamps: true, // Place timestamps option here
    toJSON: { getters: true } // Place toJSON option here
});

module.exports = mongoose.model('Problem', problemSchema);