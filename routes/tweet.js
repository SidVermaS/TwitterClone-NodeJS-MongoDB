import express from 'express'
const router=express.Router()

import mongoose from 'mongoose'
import findHashtags from 'find-hashtags'

import Tweet from '../models/Tweet'

router.post('/', async (req, res)=> {
    try {
        const reqBody=req.body
        reqBody.profile_id=new mongoose.Types.ObjectId(reqBody.profile_id)
        let tweet
        const hashtags=findHashtags(reqBody.text)
        if(hashtags.length) {
            if(reqBody.photo_url_tweet)  {
                tweet=Tweet({
                    _id: new mongoose.Types.ObjectId,
                    text: reqBody.text,                    
                    hashtags: hashtags,
                    photo_url_tweet: reqBody.photo_url_tweet,
					liked_users: [],
                    likes: 0,					
                    retweets: 0,
                    created: Date.now(),
                    profile_id: reqBody.profile_id
                })
            }   else    {
                tweet=Tweet({
                    _id: new mongoose.Types.ObjectId,
                    text: reqBody.text,
                    hashtags: hashtags,					
					liked_users: [],
                    likes: 0,
                    retweets: 0,
                    created: Date.now(),
                    profile_id: reqBody.profile_id
                })
            }
        }   else    {
            if(reqBody.photo_url_tweet)  {
                tweet=Tweet({
                    _id: new mongoose.Types.ObjectId,
                    text: reqBody.text,
                    photo_url_tweet: reqBody.photo_url_tweet,
					liked_users: [],
                    likes: 0,
                    retweets: 0,
                    created: Date.now(),
                    profile_id: reqBody.profile_id
                })
            }   else    {
                tweet=Tweet({
                    _id: new mongoose.Types.ObjectId,
                    text: reqBody.text,
					liked_users: [],
                    likes: 0,
                    retweets: 0,
                    created: Date.now(),
                    profile_id: reqBody.profile_id,
                })
            }
        }
        const savedTweet=await tweet.save()
       
        if(savedTweet)  {
            return res.status(201).json({ message: 'Successfully tweeted', tweet: savedTweet })
        }   else    {
            return res.status(400).json({ message: 'Failed to tweet' })
        }
    }   catch(err)  {
        return res.status(500).json({ message: 'Failed to tweet', error: err })
    }
})

router.post('/retweet', async (req, res)=> {
    try {
        const reqBody=req.body
        reqBody.profile_id=new mongoose.Types.ObjectId(reqBody.profile_id)
        reqBody.retweet_id=new mongoose.Types.ObjectId(reqBody.retweet_id)
        let tweet
        const hashtags=findHashtags(reqBody.text)
        if(reqBody.with_comment)    {
            if(hashtags.length) {
                if(reqBody.photo_url_tweet)  {
                    tweet=Tweet({
                        _id: new mongoose.Types.ObjectId,
                        text: reqBody.text,                    
                        hashtags: hashtags,
                        photo_url_tweet: reqBody.photo_url_tweet,
                        likes: 0,
                        retweets: 0,
                        created: Date.now(),
                        retweet_id: reqBody.retweet_id,
                        profile_id: reqBody.profile_id,                   
                    })
                }   else    {
                    tweet=Tweet({
                        _id: new mongoose.Types.ObjectId,
                        text: reqBody.text,
                        hashtags: hashtags,
                        likes: 0,
                        retweets: 0,
                        created: Date.now(),
                        retweet_id: reqBody.retweet_id,
                        profile_id: reqBody.profile_id, 
                    })
                }
            }   else    {
                if(reqBody.photo_url_tweet)  {
                    tweet=Tweet({
                        _id: new mongoose.Types.ObjectId,
                        text: reqBody.text,
                        photo_url_tweet: reqBody.photo_url_tweet,
                        likes: 0,
                        retweets: 0,
                        created: Date.now(),
                        retweet_id: reqBody.retweet_id,
                        profile_id: reqBody.profile_id, 
                    })
                }   else    {
                    tweet=Tweet({
                        _id: new mongoose.Types.ObjectId,
                        text: reqBody.text,
                        likes: 0,
                        retweets: 0,
                        created: Date.now(),
                        retweet_id: reqBody.retweet_id,
                        profile_id: reqBody.profile_id, 
                    })
                }
            }
        }   else    {
            tweet=Tweet({
                _id: new mongoose.Types.ObjectId,
                text: reqBody.text,
                created: Date.now(),
                retweet_id: reqBody.retweet_id,
                profile_id: reqBody.profile_id, 
            })
        }
        const savedTweet=await tweet.save()
       
        if(savedTweet)  {
            return res.status(200).json({ message: 'Successfully retweeted', tweet: savedTweet })
        }   else    {
            return res.status(400).json({ message: 'Failed to retweet' })
        }
    }   catch(err)  {
        return res.status(500).json({ message: 'Failed to retweet', error: err })
    }
})

router.get('/profile', async (req, res)=>  {
    try {
        const reqQuery=req.query
		reqQuery._id=mongoose.Types.ObjectId(reqQuery._id)
		reqQuery.profile_id=mongoose.Types.ObjectId(reqQuery.profile_id)
        reqQuery.index=parseInt(reqQuery.index)

        const foundTweets=await Tweet.aggregate([
            {
                $lookup:    {
                    from: 'profiles',
                    localField: 'profile_id',
                    foreignField: '_id',
                    as: 'profile'
                },	
            },
            {
                $project:   {
                    text: 1,
                    photo_url_tweet: 1,
                    likes: 1,
                    retweets: 1,
                    created: 1,
                    retweet_id: 1,   
					profile: {
						_id: 1,
						name: 1,
						username: 1,
						photo_url_profile: 1,
					},
					is_liked: {
						$in: [reqQuery._id, "$liked_users"]
					}	
                }
            },
			{
				$match:	{
					'profile._id': reqQuery.profile_id
				}		
			}	
        ]).sort({ created: -1 }).skip(reqQuery.index).limit(15)


        if(foundTweets)   {
            return res.status(200).json({ message: 'Successfully fetched the profile\'s tweets', tweets: foundTweets })
        }   else    {
            return res.status(500).json({ message: 'Failed to fetch the profile\'s tweets', })
        }
    }   catch(err)  {
        return res.status(500).json({ message: 'Failed to fetch the profile\'s tweets', error: err })
    }
})

router.patch('/favorite', async (req, res)=>	{
	const reqBody=req.body
	try	{		
		
		reqBody.tweet_id=mongoose.Types.ObjectId(reqBody.tweet_id)
		reqBody.profile_id=mongoose.Types.ObjectId(reqBody.profile_id)
		
		let updatedTweet
		
		if(reqBody.is_liked)	{
			
			updatedTweet=await Tweet.updateOne(
				{ _id: reqBody.tweet_id },
				{
					$addToSet:	{
						liked_users: reqBody.profile_id	
					},
					$inc:	{
						likes: 1	
					}	
				}		
			)	
			
		}	else	{
			updatedTweet=await Tweet.updateOne(
				{ _id: reqBody.tweet_id },
				{ 
					$pull: {
						liked_users: reqBody.profile_id	
					},
					$inc:	{
						likes: -1
					}		
				}	
			)
		}	
		//	updatedTweet=updatedTweet.toObject()
		let result=JSON.parse(JSON.stringify(updatedTweet))
		if(result['n']>0)   {
			
			
			let result=JSON.parse(JSON.stringify(updatedTweet))
			return res.status(200).json({ message: `Successfully ${reqBody.is_liked?'':'un'}favorited`, tweet: result })
		}   else    {
			return res.status(500).json({ message: `Failed to ${reqBody.is_liked?'':'un'}favorite`, })
		}		
	}   catch(err)  {
        return res.status(500).json({ message: `Failed to ${reqBody.is_liked?'':'un'}favorite`, error: err })
    }
})	

router.get('/', async (req, res)=>  {
    try {
        const reqQuery=req.query
        reqQuery._id=mongoose.Types.ObjectId(reqQuery._id)
        reqQuery.index=parseInt(reqQuery.index)

        const foundTweets=await Tweet.aggregate([
            {
                $lookup:    {
                    from: 'profiles',
                    localField: 'profile_id',
                    foreignField: '_id',
                    as: 'profile'
                },	
            },
            {
                $project:   {
                    text: 1,
                    photo_url_tweet: 1,
                    likes: 1,
                    retweets: 1,
                    created: 1,
                    retweet_id: 1,   
					profile: {
						_id: 1,
						name: 1,
						username: 1,
						photo_url_profile: 1
					},
					is_liked: {
						$in: [reqQuery._id, "$liked_users"]
					}	
                }
            }
        ]).sort({ created: -1 }).skip(reqQuery.index).limit(15)


        if(foundTweets)   {
            return res.status(200).json({ message: 'Successfully fetched the tweets', tweets: foundTweets })
        }   else    {
            return res.status(500).json({ message: 'Failed to fetch the tweets', })
        }
    }   catch(err)  {
        return res.status(500).json({ message: 'Failed to fetch the tweets', error: err })
    }
})

router.post('/delete', async (req, res)=>{
    try {
        const reqBody=req.body

        const result=await Tweet.deleteOne({ _id: reqBody._id })
        console.log('~~ del: ',result)
        if(result)  {
            return res.status(200).json({ message: 'Successfully deleted the tweet', })
        }   else    {
            return res.status(400).json({ message: 'Failed to delete the tweet' })
        }
    }   catch(err)  {
        return res.status(500).json({ message: 'Failed to delete the tweet', error: err })
    }
})

export default router