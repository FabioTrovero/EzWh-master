const sqlite = require('sqlite3');
const express = require('express');
const { check, oneOf, validationResult, body } = require("express-validator");
const DB = require('../database/EzWh_Database.js');
const testDescriptorController= require('../controller/testDescriptorController.js')
const service = require('../services/testDescriptorService')
const SKUController=require('../controller/SKUController') 

const SKU=new SKUController();
const db = new DB('EzWh.db');
const td0 = new testDescriptorController();
const serv = new service(td0);

try{
    db.startConnection();
    //console.log('Start connection to Database...')
  }
  catch (err){
    console.log('Error in connection to Database')
  }


module.exports=function(app){

    //GET /api/testDescriptors
app.get('/api/testDescriptors', async (req,res) => {
    /*if(!req.session.loggedin && (req.session.user.type!="manager"||req.session.user.type!="qualityEmployee")){
      res.status(401).json({error: '401 Unauthorized'});
    }
    */
    try {
      const tdlist = await serv.getAllTestDescriptor(db);
      return res.status(200).json(tdlist);
    } catch (err) {
      return res.status(500).json({error: 'Internal Server Error'});
    }
  });
  
  //GET /api/testDescriptors/:id
  
  app.get('/api/testDescriptors/:id', async (req,res) => {
   /* if(!req.session.loggedin && req.session.user.type!="manager"){
      res.status(401).json({error: '401 Unauthorized'});
    }
    */
      if(!Number.isInteger(parseInt(req.params.id))) {
        return res.status(422).send("422: Unprocessable Entity");
        }
      try {
        const td = await serv.getTestDescriptor(db,req.params.id);
        
        res.status(200).json(td);
      } catch (err) {
        if(err.err==404){
          return res.status(404).send('404 Not Found');
        }
        else{
          return res.status(500).send("500: Internal Server Error")
        }
        ;
      }
  });
  
  //POST /api/testDescriptor
  
  app.post('/api/testDescriptor',
    [check("name").exists().notEmpty(), 
    check("procedureDescription").exists().notEmpty(),
    check("idSKU").exists().isNumeric().notEmpty()],
    async (req,res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(422).send("422: Unprocessable Entity");
      }
      let td = req.body;
      try{
       let s=await SKU.getSKUById(db,td.idSKU);
      } 
        catch(err){

          console.log(err);
          if(err.err==404){
            return res.status(404).send('404 Not Found');//problemi con gestione errori
          }
        } 
    try{
      serv.store(db,td);
  
    }catch(err){
      return res.status(503).send('503 Service Unavailable');
    }
     return res.status(201).send('201 Created');
  });
  
  //PUT /api/testDescriptor/:id
  
  
  
  app.put('/api/testDescriptor/:id',
  [check("newName").exists(), 
    check("newProcedureDescription").exists(),
    check("newIdSKU").exists().isNumeric()],
   async (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() || !Number.isInteger(parseInt(req.params.id))) {
      return res.status(422).send("422: Unprocessable Entity");
      }
    const newTd = req.body;
    const id=req.params.id;
      try{
        await serv.getTestDescriptor(db,id);
      }catch(err){
        if(err.err==404){
          return res.status(404).send('404 Not Found');
        }
      }
      try{
        await SKU.getSKUById(db,req.body.newIdSKU) 
      } 
        catch(err){
          if(err.err==404){
            return res.status(404).send('404 Not Found');
          }
        } 
    
    try{
      await serv.update(db,id,newTd);
    }catch(err){
      return res.status(503).send('503 Service Unavailable');
    }
    return res.status(200).send('200 OK');
  });
  
  //DELETE /api/testDescriptor/:id
  
  app.delete('/api/testDescriptor/:id', async (req,res) => {// non ritorna gli stati non capisco
    const id = req.params.id;
    if(!Number.isInteger(parseInt(req.params.id))) {
      return res.status(422).send("422: Unprocessable Entity");
      }
    try{
      serv.delete(db,id);
    }catch(err){
      return res.status(503).send('503 Service Unavailable');
    }  
    return res.status(204).send( '204 No Content');
  });

}