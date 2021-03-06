import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import fileupload from 'express-fileupload'
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
app.use('/uploads/tweets', express.static(__dirname+'/uploads/tweets'))
app.use('/uploads/profiles', express.static(__dirname+'/uploads/profiles'))
app.use('/uploads/lists', express.static(__dirname+'/uploads/lists'))
app.use('/profile',profileRouter)
app.use('/list',listRouter)

app.use(fileupload())
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

mongoose.connect('mongodb+srv://', { useNewUrlParser: true, useUnifiedTopology: true }, ()=>  {
    console.log('connected to DB')
})

export default app