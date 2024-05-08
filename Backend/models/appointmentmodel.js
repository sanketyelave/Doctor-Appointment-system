const mongoose = require('mongoose')
const Schema = mongoose.Schema

const appointmentSchema = new Schema({
     patient_id:{
        type:String,
        required:true
     },
     doctor_id:{
        type:String,
        required:true
     },
     day:{
        type:String,
        required:true
     },
     time:{
        type:String,
        required:true
     },
     delay:{
      type:String,
      default:0
     }
})

appointmentSchema.statics.make = async function (patient_id,doctor_id,day,time ) {
   if (!patient_id || doctor_id) {
     throw error("patientid is missing");
   }
 
   const appointment = await this.create({ patient_id,doctor_id,day,time });
   return appointment;
 };

module.exports= mongoose.model('Appointment', appointmentSchema);