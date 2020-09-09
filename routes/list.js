import express from 'express'
const router=express.Router()

import mongoose from 'mongoose'

import List from '../models/List'

router.post('/', async (req, res)=> {
    try {
        const reqBody=req.body
        reqBody.profile_id=new mongoose.Types.ObjectId(reqBody.profile_id)
        let list

        if(reqBody.photo_url_list)  {
            list=List({
                _id: new mongoose.Types.ObjectId,
                name: reqBody.name,
                description: reqBody.description,
                photo_url_list: reqBody.photo_url_list,
                created: Date.now(),
				pinned: false,
                profile_id: reqBody.profile_id
            })
        }   else    {
            list=List({
                _id: new mongoose.Types.ObjectId,
                name: reqBody.name,
                description: reqBody.description,
                created: Date.now(),
				pinned: false,
                profile_id: reqBody.profile_id,
            })
        }
        
        const savedList=await list.save()
       
        if(savedList)  {
            return res.status(201).json({ message: 'Successfully created a new list', list: savedList })
        }   else    {
            return res.status(400).json({ message: 'Failed to create a new list' })
        }
    }   catch(err)  {
        return res.status(500).json({ message: 'Failed to create a new list', error: err })
    }
})

router.get('/', async (req, res)=>  {
    try {
        const reqQuery=req.query
        reqQuery._id=mongoose.Types.ObjectId(reqQuery._id)
        reqQuery.index=parseInt(reqQuery.index)

        const foundList=await List.aggregate([
            {
                $lookup: {
                    from: 'profiles',
                    localField: 'profile_id',
                    foreignField: '_id',
                    as: 'profile'
                }
            },
            {
                $project:   {
                    _id: 1,
                    title: 1,
                    description: 1,
                    profile:    {
                        _id: 1,
                        username: 1,
                        name: 1,                        
                        photo_url_profile: 1,                        
                    }
                }
            }
        ]).sort({ created: -1 }).skip(reqQuery.index).limit(15)

        if(foundList)   {
            return res.status(200).json({ message: 'Successfully fetched the lists', lists: foundList })
        }   else    {
            return res.status(500).json({ message: 'Failed to fetch the lists', })
        }
    }   catch(err)  {
        return res.status(500).json({ message: 'Failed to fetch the lists', error: err })
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