import express from 'express'
const router=express.Router()

import md5 from 'md5'
import jwt from 'jsonwebtoken'

import Profile from '../models/Profile'

router.post('/', async (req, res)=>    {
    try {
		console.log('~~~ pu',req.body)
        const reqProfile=req.body
	 
        const profile=new Profile({
            username: reqProfile.username,
            password: md5(reqProfile.password)
        }) 
	
        if(await Profile.findOne({ username: profile.username }).select('_id'))    {
			
            let foundProfile=await Profile.findOne({ username: profile.username, password: profile.password }).select('_id username name')
           
			if(foundProfile)  {
                if(reqProfile.token)    {
                    const profile1=Profile({
                        token: reqProfile.token
                    })
                    await Profile.updateOne({ _id: foundProfile._id }, { $set: profile1 })
                }
                const privateKey='secretkey'
                const authorization=jwt.sign({ profile }, privateKey)
				foundProfile=foundProfile.toObject()
                foundProfile['authorization']=authorization
				
                return res.status(200).json({ message: 'Successfully logged in', profile: foundProfile })
            }   else    {            
                return res.status(400).json({  message: 'Invalid credentials' })  
            }
        }   else    {
            return res.status(400).json({ message: 'Email is not registered' })
        }    
    }   catch(err)  {
        return res.status(500).json({ message: 'Failed to login', error: err })
    }
})

export default router