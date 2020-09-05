import express from 'express'
const router=express.Router()

import mongoose from 'mongoose'

import Profile from '../models/Profile'

router.get('/', async (req, res)=> {
    try {
        const reqQuery=req.query
        reqQuery._id=mongoose.Types.ObjectId(reqQuery._id)		
		
       // const foundProfile=await Profile.findOne({ username: reqParams.username }).select('_id name username bio loc joint photo_url_profile photo_url_cover')
       
		const foundProfile=await Profile.aggregate([
			{
				$project:	{
					_id: 1,
					name: 1,
					username: 1,
					bio: 1,
					loc: 1,
					joint: 1,
					photo_url_profile: 1,
					photo_url_cover: 1,
					is_followed: {
						$in: [reqQuery._id, "$followers"]
					}
				}
			},
		])
	   
        if(foundProfile)  {
            return res.status(200).json({ message: 'Successfully fetched the profile', profile: foundProfile })
        }   else    {
            return res.status(400).json({ message: 'Failed to fetch the profile' })
        }
    }   catch(err)  {
        return res.status(500).json({ message: 'Failed to fetch the profile', error: err })
    }
})

router.get('/followers', async (req, res)=> {
    try {
        const reqQuery=req.query
        reqQuery._id=mongoose.Types.ObjectId(reqQuery._id)
        reqQuery.index=parseInt(reqQuery.index)
/*
        const foundFollowers=await Follow.find({ following: reqQuery._id }).select('_id name username photo_url_profile').skip(reqQuery.index).limit(15)
       
        if(foundFollowers)  {
            return res.status(200).json({ message: 'Successfully fetched the followers', followers: foundFollowers })
        }   else    {
            return res.status(400).json({ message: 'Failed to fetch the followers' })
        }*/
    }   catch(err)  {
        return res.status(500).json({ message: 'Failed to fetch the followers', error: err })
    }
})
router.get('/following', async (req, res)=> {
    try {
        const reqQuery=req.query
        reqQuery._id=mongoose.Types.ObjectId(reqQuery._id)
        reqQuery.index=parseInt(reqQuery.index)
/*
        const foundFollowing=await Follow.find({ follower: reqQuery._id }).select('_id name username photo_url_profile photo_url_cover').skip(reqQuery.index).limit(15)
       
        if(foundFollowing)  {
            return res.status(200).json({ message: 'Successfully fetched the following', following: foundFollowing })
        }   else    {
            return res.status(400).json({ message: 'Failed to fetch the following' })
        }*/
    }   catch(err)  {
        return res.status(500).json({ message: 'Failed to fetch the following', error: err })
    }
})
router.patch('/', async (req, res)=> {
    try {
        const reqBody=req.body
        const list=List({
            _id: mongoose.Types.ObjectId(reqBody._id),
            pinned: reqBody.pinned
        })
        const result=await List.updateOne({ _id: list._id }, { $set: list } )
        if(result['nModified']>0)  {
            return res.status(200).json({ message: 'Successfully changed the pin', result: result })
        }   else    {
            return res.status(400).json({ message: 'Failed to change the pin' })
        }
    }   catch(err)  {
        return res.status(500).json({ message: 'Failed to change the pin', error: err })
    }
})

router.post('/delete', async (req, res)=>{
    try {
        const reqBody=req.body

        const result=await List.deleteOne({ _id: reqBody._id })
        console.log('~~ del: ',result)
        if(result)  {
            return res.status(200).json({ message: 'Successfully deleted the list', })
        }   else    {
            return res.status(400).json({ message: 'Failed to delete the list' })
        }
    }   catch(err)  {
        return res.status(500).json({ message: 'Failed to delete the list', error: err })
    }
})

export default router