import express from 'express'
const router=express.Router()

import mongoose from 'mongoose'
import md5 from 'md5'

import Profile from '../models/Profile'

router.post('/', async (req, res)=>{
    try {
        const reqProfile=req.body

        const profile=new Profile({
            _id: new mongoose.Types.ObjectId,
            email: reqProfile.email,
            password: md5(reqProfile.password),
            username: reqProfile.username,
            name: reqProfile.name,
            joint: Date.now(),
            photo_url_profile: null,
			followers: [],
			following: [],
        })
        if(await Profile.findOne({$or: [ {email: profile.email}, {username: profile.username} ]}).select('_id')) {
            return res.status(400).json({ message: 'Email/Username is already registered' })
        } else    {            
            const savedProfile=await profile.save()
            
            if(savedProfile)   {
                return res.status(201).json({ message: 'Successfully registered' })
            }   else    {
                return res.status(400).json({ message: 'Failed to register' })
            }
        }
    }   catch(err)  {
        return res.status(500).json({ message: 'Failed to register', error: err })
    }
})

export default router