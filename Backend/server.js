const express = require("express");
const mongoose = require("mongoose");
const patientRoutes = require('./routes/patientRoutes')
const doctorRoutes = require('./routes/doctorRoutes')
const patientAppointmentRoutes = require('./routes/appointmentRoutes')
const PORT = process.env.PORT
require("dotenv").config();
const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("connected to mongodb and listening at port");
    });
  })
  .catch((err) => {
    console.log(err);
});

app.use("/", patientRoutes);
app.use('/doctor',doctorRoutes)
app.use('/appointment',patientAppointmentRoutes)
