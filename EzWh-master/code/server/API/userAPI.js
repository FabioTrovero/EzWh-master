const sqlite = require('sqlite3');
const express = require('express');
const session = require('express-session');
const { check, oneOf, validationResult, body } = require("express-validator");
const DB = require('../database/EzWh_Database.js');
const userController= require('../controller/UserController')
const service = require('../services/userService')

const db = new DB('EzWh.db');
const us0 = new userController();
const serv=new service(us0);

try{
    db.startConnection();
    //console.log('Start connection to Database...')
  }
  catch (err){
    console.log('Error in connection to Database')
  }

  try{

   us0.addDefaultUsers(db);
}
catch(err){console.log(err);}

//USER


module.exports=function(app){


//GET /api/userinfo

app.get('/api/userinfo', async (req,res) => {
  /*if(req.session.loggedin==false){
    return res.status(401).send("401 Unauthorized");
  }
  let id = req.session.user.id;
  let us;
  try{
    us= await serv.getUser(db,id);
  }catch(err){
    return res.status(500).send('500 Internal Server Error');
  }*/
  
  return res.status(200).end()//.json(us);
})

//GET /api/suppliers

app.get('/api/suppliers', async (req,res) => {
    /*if(req.session.loggedin==false){
      res.status(401).send("401 Unauthorized");
    }*/
    
    try{
      const sup= await serv.getSuppliers(db);
      return res.status(200).json(sup);
  
    }catch(err){
      return res.status(500).send('500 Internal Server Error');
    }
    
  });
  
  //GET /api/users
  
  app.get('/api/users', async (req,res) => {
    /*if(req.session.loggedin==false||req.session.type!="manager"){
      res.status(401).send("401 Unauthorized");
    }*/
    
    try{
      const us= await serv.getUsersNoManager(db);
      return res.status(200).json(us);
    }catch(err){
      return res.status(500).send('500 Internal Server Error');
    }
     
  });
  
  //POST /api/newUser
  
  app.post('/api/newUser',// da sistemare
  [check("username").exists().isEmail().notEmpty(), 
    check("name").exists().notEmpty(), 
    check("surname").exists().notEmpty(),
    check("password").exists().notEmpty(),
    check("type").exists().notEmpty()],
   async (req,res) => {
    /*if(!req.session.loggedin && req.session.user.type!="manager"){
      res.status(401).send('401 Unauthorized');
    }*/
    const errors = validationResult(req);

    if (!errors.isEmpty()||req.body.password.length<7) {
      return res.status(422).send("422: Unprocessable Entity");
    }
    if(req.body.type!="manager"&&req.body.type!="customer"&&req.body.type!="qualityEmployee"&&req.body.type!= "clerk"&&req.body.type!= "deliveryEmployee"&&req.body.type!="supplier"){
      return res.status(422).send("422: Unprocessable Entity");
    }
    let user = req.body;
    try {
      await serv.store(db,user);
    }catch(err){
      console.log(err.err);
      if(err.err==409){
        return res.status(409).send("409 Conflict");
      }
      else{
        return res.status(503).send("503: Service Unavailable");
      }
      
    }
    return res.status(201).send('201 created');
  });
  
  //POST /api/managerSessions
  
  app.post('/api/managerSessions', async (req,res) => {
    let user = req.body;
    let us
    try{
      us= await serv.login(db,user.username,user.password,"manager");
    }catch(err){
      if(err.err==404){
        return res.status(401).send('401 Unauthorized');
      }
      return res.status(500).send('500 Internal Server Error');
    }
    if(us==undefined){
      return res.status(401).send('401 Unauthorized');
    /*}else{
      req.session.loggedin=true;
      req.session.user={
        id: us.id,
        type: "manager"
        }*/
    }
    return res.status(200).json(us);
  });
  
  //POST /api/customerSessions
  app.post('/api/customerSessions', async (req,res) => {
    let user = req.body;
    let us;
    try{
       us= await serv.login(db,user.username,user.password,"customer");
    }catch(err){
      if(err.err==404){
        return res.status(401).send('401 Unauthorized');
      }
      return res.status(500).send('500 Internal Server Error');
    }
   
    if(!us){
      return res.status(401).send('401 Unauthorized');
    }else{
      req.session.loggedin=true;
      req.session.user={
        id: us.id,
        type: "customer"
        }
    }
    return res.status(200).json(us);
  });
  
  //POST /api/supplierSessions
  app.post('/api/supplierSessions', async (req,res) => {
    let user = req.body;
    let us;
    try{
      us= await serv.login(db,user.username,user.password,"supplier");
    }catch(err){
      if(err.err==404){
        return res.status(401).send('401 Unauthorized');
      }
      return res.status(500).send('500 Internal Server Error');
    }
    if(us==undefined){
      return res.status(401).send('401 Unauthorized');
    /*}else{
      req.session.loggedin=true;
      req.session.user={
        id: us.id,
        type: "supplier"
        }*/
    }
    return res.status(200).json(us);
  });
  
  
  //POST /api/clerkSessions
  app.post('/api/clerkSessions', async (req,res) => {
    let user = req.body;
    let us;
    try{
      us= await serv.login(db,user.username,user.password,"clerk");
    }catch(err){
      if(err.err==404){
        return res.status(401).send('401 Unauthorized');
      }
      return res.status(500).send('500 Internal Server Error');
    }
    if(us==undefined){
      return res.status(401).send('401 Unauthorized');
    /*}else{
      req.session.loggedin=true;
      req.session.user={
        id: us.id,
        type: "clerk"
        }*/
    }
    return res.status(200).json(us);
  });
  
  //POST /api/qualityEmployeeSessions
  app.post('/api/qualityEmployeeSessions', async (req,res) => {
    let user = req.body;
    let us;
    try{
      us= await serv.login(db,user.username,user.password,"qualityEmployee");
    }catch(err){
      if(err.err==404){
        return res.status(401).send('401 Unauthorized');
      }
      return res.status(500).send('500 Internal Server Error');
    }
    if(us==undefined){
      return res.status(401).send('401 Unauthorized');
    /*}else{
      req.session.loggedin=true;
      req.session.user={
        id: us.id,
        type: "qualityEmployee"
        }*/
    }
    return res.status(200).json(us);
  });
  
  //POST /api/deliveryEmployeeSessions
  app.post('/api/deliveryEmployeeSessions', async (req,res) => {
    let user = req.body;
    let us;
    try{
      us= await serv.login(db,user.username,user.password,"deliveryEmployee");
    }catch(err){
      if(err.err==404){
        return res.status(401).send('401 Unauthorized');
      }
      return res.status(500).send('500 Internal Server Error');
    }
    if(us==undefined){
      return res.status(401).send('401 Unauthorized');
    /*}else{
      req.session.loggedin=true;
      req.session.user={
        id: us.id,
        type: "deliveryEmployee"
        }*/
    }
    return res.status(200).json(us);
  });
  
  //POST /api/logout
  
  app.post('/api/logout', async (req,res) => {
    /*if(req.session.loggedin==true){
      req.session.loggedin=false;
      req.session.user=null;*/
      return res.status(200).send('OK').end();/*
    }
     else{
      return res.status(500).send("500: Internal Server Error");
     }*/

  });
  
  //PUT  /api/users/:username
  
  app.put('/api/users/:username',
  [check("oldType").exists(), 
    check("newType").exists()],
   async (req,res) => {
    /*if(!req.session.loggedin && req.session.user.type!="manager"){
      res.status(401).send('401 Unauthorized');
    }*/
   const username=req.params.username;
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
    return res.status(422).send("422: Unprocessable Entity");
  }
  if(!username&&req.body.oldType!="customer"&&req.body.oldType!="qualityEmployee"&&req.body.oldType!= "clerk"&&req.body.oldType!= "deliveryEmployee"&&req.body.oldType!="supplier"){
    return res.status(422).send("422: Unprocessable Entity");
  }
  if(req.body.newType!="customer"&&req.body.newType!="qualityEmployee"&&req.body.newType!= "clerk"&&req.body.newType!= "deliveryEmployee"&&req.body.newType!="supplier"){
    return res.status(422).send("422: Unprocessable Entity");
  }
  try{
    await serv.update(db,username,req.body);
  }catch(err){
    if(err.err==404){
      return res.status(404).send('404 Not found');
    }
    else{
      return res.status(503).send('503 Service Unavailable');
    }
    
    }
    return res.status(200).send('OK');
  });
  
  //DELETE /api/users/:username/:type
  app.delete('/api/users/:username/:type', async (req,res) => {
    /*if(!req.session.loggedin && req.session.user.type!="manager"){
      res.status(401).send('401 Unauthorized');
    }*/
    const username = req.params.username;
    const type = req.params.type;
  
    if(!username||!type||(type!="customer"&&type!="qualityEmployee"&&type!= "clerk"&&type!= "deliveryEmployee"&&type!="supplier")){
      return res.status(422).send("422: Unprocessable Entity");
    }
    if(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(username)==false){
      return res.status(422).send("422: Unprocessable Entity");
    }
    try{
      serv.delete(db,username,type);
    }catch(err){
      return res.status(503).send('503 Service Unavailable');
    }  
    return res.status(204).send('No Content');
  });

}