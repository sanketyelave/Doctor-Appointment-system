const express = require('express')
const router = express.Router()
const Doctor = require('../models/doctormodel')
const jwt = require('jsonwebtoken')

const createToken = (_id)=>{
   return jwt.sign({_id},process.env.SECRET,{expiresIn:'3d'})
}

const logindoctor = async(req,res) =>{
    const {email,password} = req.body
    
    try{
        const doctor = await Doctor.login(email,password)
        const token = createToken(doctor._id)
        
        res.status(200).json({email,token})
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

const signupdoctor = async(req,res) =>{
    const { Name,email, password,phonenumber,department,workingDays } = req.body
    try{
        const doctor = await Doctor.signup(Name,email,password,phonenumber,department,workingDays)

        res.status(200).json(doctor)
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

router.post('/login', logindoctor)

router.post('/signup', signupdoctor)

module.exports = router;