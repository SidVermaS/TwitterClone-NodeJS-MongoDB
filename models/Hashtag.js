import mongoose from 'mongoose'

const HashtagSchema=mongoose.Schema({
    _id:    {
        type: mongoose.Schema.Types.ObjectId,
        requried: true
    },
    tag:  {
        type: String,
        required: true,
    },
    count:  {
        type: Number,
        required: true
    }
})

export default mongoose.model('hastags', HashtagSchema)