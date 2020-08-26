import mongoose from 'mongoose'

const FollowSchema=mongoose.Schema({
    _id:    {
        type: mongoose.Schema.Types.ObjectId,
        requried: true
    },
    follower:    {
        type: mongoose.Schema.Types.ObjectId,
        requried: true
    },
    following:    {
        type: mongoose.Schema.Types.ObjectId,
        requried: true
    },

})

export default mongoose.model('follow', FollowSchema)