const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const patientSchema = new Schema({
     email:{
        type: String,
        required: true,
        unique: true
     },
     password:{
        type: String,
        required: true
     }
})

patientSchema.statics.signup = async function(email,password){
   if(!email || !password){
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
   const patient = await this.create({email, password: hash})
   return patient
}

userSchema.statics.login = async function(email,password){
   if(!email || !password){
      throw Error('All fields must be filled')
   }
   const patient = await this.findOne({email})
   if(!user){
      throw Error('Incorrect Email')
   }
   
   const match = await bcrypt.compare(password,user.password)

   if(!match){
      throw Error('Incorrect password')
   }

   return patient
}

module.exports= mongoose.model('Patient', patientSchema)