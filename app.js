import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import registerRouter from './routes/register'
import loginRouter from './routes/login'

import tweetRouter from './routes/tweet'
import profileRouter from './routes/profile'
import listRouter from './routes/list'
import uploadRouter from './routes/upload'

const app=express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json({ limit: '50mb' }))


app.use('/login', loginRouter)
app.use('/register', registerRouter)

// app.use(verifyToken)
app.use('/tweet',tweetRouter)
app.use('/upload/tweet', express.static(__dirname+'/upload/tweet'))
app.use('/upload/profile', express.static(__dirname+'/upload/profile'))
app.use('/upload/list', express.static(__dirname+'/upload/list'))
app.use('/profile',profileRouter)
app.use('/list',listRouter)
app.use('/upload', uploadRouter)

function verifyToken(req, res, next)  {
    const bearerHeader=req.headers['authorization']

    if(typeof bearerHeader==='undefined')   {
        return res.status(403).json({ message: 'Unauthorized access' })
    }   else    {
        const bearer=bearerHeader.split(' ')
        const bearerToken=bearer[1]

        const privateKey='secretkey'
        jwt.verify(bearerToken, privateKey, (err, authData)=>   {
            if(err) {
                return res.status(403).json({ message: 'Unauthorized access' })
            }   else    {
                next()
            }
        })
    }
}

mongoose.connect('mongodb+srv://test:test@cluster0.2sl9y.mongodb.net/twitter_db?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true }, ()=>  {
    console.log('connected to DB')
})

export default app