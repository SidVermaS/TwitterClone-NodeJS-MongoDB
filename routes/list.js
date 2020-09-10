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
                    name: 1,
                    description: 1,
					photo_url_list: 1,
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

router.get('/pinned/:_id', async (req, res)=>  {
    try {
        const reqParams=req.params
        reqParams._id=mongoose.Types.ObjectId(reqParams._id)
		
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
                    name: 1,
                    description: 1,
					photo_url_list: 1,
					pinned: 1,
					profile_id: 1,
                    profile:    {
                        _id: 1,
                        username: 1,
                        name: 1,                        
                        photo_url_profile: 1,                        
                    }
                }
            },
			{
				$match:	{
					pinned: true,
					profile_id: reqParams._id
				}		
			}
        ]).sort({ created: -1 }).skip(0).limit(5)

        if(foundList)   {
            return res.status(200).json({ message: 'Successfully fetched pinned the lists', lists: foundList })
        }   else    {
            return res.status(500).json({ message: 'Failed to fetch the pinned lists', })
        }
    }   catch(err)  {
        return res.status(500).json({ message: 'Failed to fetch the pinned lists', error: err })
    }
})
router.get('/check', async (req, res)=>	{
	try	{
		const reqQuery=req.query
			
		reqQuery._id= mongoose.Types.ObjectId(reqQuery._id)
		reqQuery.profile_id= mongoose.Types.ObjectId(reqQuery.profile_id)

		const result=await List.findAll({profile_id: reqQuery.profile_id}).count()

		return res.status(200).json({ message: 'Successfully check the pin', result: result })
	}   catch(err)  {
        return res.status(500).json({ message: 'Failed to check the pinned lists', error: err })
    }
})	

router.patch('/', async (req, res)=> {
    try {
        const reqBody=req.body
        reqBody._id=mongoose.Types.ObjectId(reqBody._id)
		reqBody.profile_id=mongoose.Types.ObjectId(reqBody.profile_id)
		
		let pinnedListsCount=0
		
		if(reqBody.pinned)	{
			pinnedListsCount=await List.find({ profile_id: reqBody.profile_id, pinned: true }).count()
		}
		
		if(pinnedListsCount<6 || !reqBody.pinned)	{
			const result=await List.updateOne(
				{ 
					_id: reqBody._id 
				},
				$set: { 
					pinned: reqBody.pinned 
				}				
			)
			
			if(result['nModified']>0)  {
				return res.status(200).json({ message: 'Successfully changed the pin', list: result })
			}   else    {
				return res.status(400).json({ message: 'Failed to change the pin' })
			}
		}	else	{
			return res.status(400).json({ message: 'You’ll need to remove one pinned List before adding another', })
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