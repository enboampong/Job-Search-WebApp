const express = require('express');
const router = express.Router();
const db = require('../config/database');
const Job = require('../models/Jobs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// Get or retreive all jobs
router.get('/', (req,res) =>
 Job.findAll()
 .then(jobs => {
    const context = {
        contextJobs: jobs.map(job =>{
            return{
                title: job.title,
                technology: job.technology
,
                budget: job.budget,
                description: job.description,
                contact_email: job.contact_email
            }
        })
    }
     res.render('jobs',{
         jobs:context.contextJobs
     });
 })
 .catch(err => console.log('error :' + err)));

 // displaying the add job form
 router.get('/add', (req,res)=> res.render('add')); // the render function is rendering a view called add


 //adding a job to the database
 router.post('/add', (req,res)=> {
     
     let {title,technologies,budget,description,contact_email}= req.body;
     let errors = [];
     // server side validation to check if any of the input fields are empty
     if(!title){
         errors.push({text: 'please add a title'});
     }
     if(!technologies){
        errors.push({text: 'please add a technology'});
    }
    if(!description){
        errors.push({text: 'please add a description'});
    }
    if(!contact_email){
        errors.push({text: 'please add a contact email'});
    }

    if(errors.length >0){
       res.render('add',{
           errors,//this will send back the errors array with the newly rendered add view
           title,
           technologies,
           budget,
           description,
           contact_email
       });
    }else{
        if(!budget){
            budget='Unkwown';
        } else {
            budget=`$${budget}`;
        }

        //making the technolgies input lowercase and remove spaces after the comma
        technologies = technologies.toLowerCase().replace(/, /g, ',');

        //inserting a Job into the table of the database
     Job.create({
        title: title,
        technologies: technologies,
        budget: budget,
        description: description,
        contact_email: contact_email
    })
    .then(job =>res.redirect('/jobs'))
    .catch(err => console.log('Error: '+ err));
    }
 });
 // Search for gigs
router.get('/search', (req, res) => {
    let { term } = req.query;
  
    // Make lowercase
    term = term.toLowerCase();
  
    Job.findAll({ where: { technologies: { [Op.like]: '%' + term + '%' } } })
      .then(jobs => res.render('jobs', { jobs }))
      .catch(err => res.render('error', {error: err}));
    });
 
module.exports=router;