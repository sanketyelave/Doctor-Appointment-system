const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const Patient =require('../models/patientmodel')
const Appointment = require('../models/appointmentmodel')
require("dotenv").config();

const requireAuth = async (req,res,next)=>{

    const { authorization } = req.headers
    if(!authorization){
        return res.status(401).json({error:'Authorization token required'})
    }

    const token = authorization.split(' ')[1]

    try{
        const {_id}= jwt.verify(token,process.env.SECRET)
        req.patient= await Patient.findOne({_id}).select('_id')
        next()
    }catch{
       console.log(error)
       res.status(400).json({error:'Request is not authorized'})
    }
}

const patientAppointments = async (req, res) => {
    const { patient_id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(patient_id)) {
      return res.status(404).json({ error: "no such patient" });
    }
    const appointments = await Appointment.find({patient_id: patient_id});

    if (!appointments) {
      return res.status(404).json({ error: "No appointment in directory" });
    }
    res.status(200).json(appointments);
  };

const createAppointment = async(req,res)=>{
    const { patient_id, doctor_id,day,time } = req.body;
    if (!mongoose.Types.ObjectId.isValid(patient_id)) {
        return res.status(404).json({ error: "no such patient" });
    }
    if (!mongoose.Types.ObjectId.isValid(doctor_id)) {
        return res.status(404).json({ error: "no such doctor" });
    }
    try {
        const appointment = await Appointment.make(patient_id,doctor_id,day,time)
        res.status(200).json(appointment);
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const cancelAppointment = async(req,res)=>{
    const { _id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json({ error: "this appointment does not exist !!!" });
    }

    try {
        await Appointment.findByIdAndDelete(_id).save();
        res.status(200).json("Appointment Cancelled")
    } catch (error) {
        res.status(400).json(error.message); 
    }
}

const reschedule = async(req,res)=>{
    const { _id, day, time } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json({ error: "this appointment does not exist !!!" });
    }
    try {
        const rescheduled = await Appointment.findByIdAndUpdate({_id:_id},{ ...req.body},{ new:true }).save()
        res.status(200).json(rescheduled)
    } catch (error) {
        res.status(400).json(error.message);
    }
}

router.use(requireAuth)

router.get('/myappointments',patientAppointments)
router.post('/createappointment',createAppointment)
router.patch('/cancelappointment',cancelAppointment)
router.patch('/Patientreschedule',reschedule)

module.exports = router;