import mongoose from "mongoose"

const ListSchema=mongoose.Schema({
    _id:    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    name:   {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: false
    },
    photo_url_list:   {
        type: String,
        required: false,      
    },
    pinned:   {
        type: Boolean,
        required: true,      
    },
    created:    {
        type: Date,
        required: true    
    },
    profile_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
		ref: 'profiles'
    }
})

export default mongoose.model('lists',ListSchema)