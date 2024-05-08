const express = require('express')
const router = express.Router()
const Patient = require('../models/patientmodel')
const jwt = require('jsonwebtoken')

const createToken = (_id)=>{
   return jwt.sign({_id},process.env.SECRET,{expiresIn:'3d'})
}

const loginpatient = async(req,res) =>{
    const {email,password} = req.body
    
    try{
        const patient = await Patient.login(email,password)
        const token = createToken(patient._id)
        
        res.status(200).json({email,token})
    }catch(error){
        res.status(400).json({error:error.message})
    }
    // res.json({mssg:'login user'})
}

const signuppatient = async(req,res) =>{
    const {email, password} = req.body
    try{
        const patient = await Patient.signup(email,password)
        const token = createToken(patient._id)

        res.status(200).json({email,token})
    }catch(error){
        res.status(400).json({error:error.message})
    }
    // res.json({mssg:'signup user'})
}

router.post('/login', loginpatient)

router.post('/signup', signuppatient)

module.exports = router;