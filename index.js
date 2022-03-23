

const express=require('express');
var cors = require('cors');
require('dotenv').config();

const app=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true} ));

const allUserRoutes = require('./routes/user');
const dhbRoutes = require('./routes/dhb');
const hospitalRoutes = require('./routes/hospital');
const institutionRoutes = require('./routes/institution');

app.use(allUserRoutes);
app.use(dhbRoutes);
app.use(hospitalRoutes);
app.use(institutionRoutes);

const port=process.env.API_PORT || 8080
app.listen(port, ()=>console.log(`listening on port ${port}...at ${Date()}`));
