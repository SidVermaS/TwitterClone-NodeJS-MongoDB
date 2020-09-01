import mongoose from 'mongoose'

const LikeSchema=mongoose.Schema({
	_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true
	},
	tweet_id:    {
        type: mongoose.Schema.Types.ObjectId,
        requried: true
    },
    profile_id:    {
        type: mongoose.Schema.Types.ObjectId,
        requried: true
    },
})

export default mongoose.model('likes', LikeSchema)