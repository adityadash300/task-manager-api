const express = require('express')
const router = new express.Router()
const User = require('../models/users')
const auth  = require('../middleware/auth')


router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token  = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
 
})

router.get('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
}) 

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email','password', 'age']
    const isValidOps = updates.every((update) => allowedUpdates.includes(update))

    if(updates.length === 0) {
        return res.status(400).send({error: 'Cannot send null values.'})
    }


    if(!isValidOps) {
        return res.status(400).send({error: 'Invalid Operation'})
    }

    try {
        const user = req.user

        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.user.id)

        // if(!user) {
        //     return res.status(400).send()
        // }
        await req.user.remove()
        res.send(req.user)
    } catch(e) {
        res.status(500).send(e)
    }
})


module.exports = router