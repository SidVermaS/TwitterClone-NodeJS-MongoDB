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
    photo_url_tweet: {
        type: String,
        required: false
    },
    hashtags:   {
        type: Array,
        required: false,
    },
	liked_users:	{
		type: Array,
		required: true,
		ref: 'profiles'
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
        required: false,
    },
    profile_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
		ref: 'profiles'
    }
})

export default mongoose.model('tweets',TweetSchema)