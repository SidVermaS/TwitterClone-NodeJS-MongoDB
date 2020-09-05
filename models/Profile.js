import mongoose from 'mongoose'

const ProfileSchema=mongoose.Schema({
    _id:    {
        type: mongoose.Schema.Types.ObjectId,
        requried: true
    },
    email:  {
        type: String,
        required: true,
    },
    password:   {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    bio:  {
        type: String,
        required: false
    },
    loc:  {
        type: String,
        required: false
    },
    joint:  {
        type: Date,
        required: true
    },
    photo_url_profile:  {
        type: String,
        required: false
    },
	photo_url_cover:  {
        type: String,
        required: false
    },
	followers:	{
		type: Array,
		required: true,
	},	
	following:	{
		type: Array,
		required: true,
	},
    token:  {
        type: String,
        required: false
    }

})

export default mongoose.model('profiles', ProfileSchema)