const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const Schema = mongoose.Schema

const doctorschema = new Schema({
    Name:{
        type:String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
     },
     password:{
        type: String,
        required: true
    },
    phonenumber:{
        type:Number,
        required:true,
        unique: true
    },
    department:{
        type:String,
        required:true
    },
    workingDays:{
        type:[{ Day: String, startTime: String, endTime: String}],
        required:true
    },
})
doctorschema.statics.signup = async function(Name,email,password,phonenumber,department,workingDays){
    if(!Name || !email || !password || !phonenumber || !department || !workingDays){
       throw Error('All fields must be filled')
    }
    if(!validator.isEmail(email)){
       throw Error('Email is not valid')
    }
    if(!validator.isStrongPassword(password)){
       throw Error('Password not strong enough')
    }
    const exists = await this.findOne({email})
    if(exists){
       throw Error('Email already in use')
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password,salt)
    const doctor = await this.create({email, password: hash,Name,phonenumber,workingDays,department})
    return doctor
 }
 
doctorschema.statics.login = async function(email,password){
    if(!email || !password){
       throw Error('All fields must be filled')
    }
    const doctor = await this.findOne({email})
    if(!doctor){
       throw Error('Incorrect Email')
    }
    
    const match = await bcrypt.compare(password,doctor.password)
 
    if(!match){
       throw Error('Incorrect password')
    }
 
    return doctor
 }
 
 module.exports= mongoose.model('Doctor', doctorschema)