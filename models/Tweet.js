import mongoose from "mongoose"

const TweetSchema=mongoose.Schema({
    _id:    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    text:   {
        type: String,
        required: false
    }, 
    photos: {
        type: Array,
        required: false
    },
    hashtags:   {
        type: Array,
        required: false,
    },
    likes:   {
        type: Number,
        required: true,      
    },
    retweets:   {
        type: Number,
        required: true,      
    },
    created:    {
        type: Date,
        required: true    
    },
    retweet_id:    {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    profile_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

export default mongoose.model('tweets',TweetSchema)