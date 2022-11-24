const sqlite = require('sqlite3');
const express = require('express');
const { check, oneOf, validationResult, body } = require("express-validator");
const DB = require('../database/EzWh_Database.js');
const testResultC= require('../controller/testResultController')
const SKUItemController = require('../controller/SKUItemController');
const service = require('../services/testResultService')
const dayjs = require('dayjs');

const SKUItem = new SKUItemController();
const db = new DB('EzWh.db');
const tr0 = new testResultC();
const serv=new service(tr0);
try{
    db.startConnection();
    //console.log('Start connection to Database...')
  }
  catch (err){
    console.log('Error in connection to Database')
  }


  function isValidDate(date){
    if(!(dayjs(date, 'YYYY/MM/DD HH:mm', true).isValid() 
    || dayjs(date, 'YYYY/MM/DD', true).isValid())){
      return false;
    }
    return true;  
  }


  module.exports=function(app){
      //GET /api/skuitems/:rfid/testResults

app.get('/api/skuitems/:rfid/testResults', async (req,res) => {
    const rfid=req.params.rfid;
    if(!Number.isInteger(parseInt(rfid))) {
      return res.status(422).send("422: Unprocessable Entity");
      }
      let skui;
    try {
       skui = await SKUItem.getSKUItemByRFID(db,rfid);//contollare

    } catch (err) {
      if(err.err==404){
        return res.status(404).send('404 Not Found');
      }
      else{
        return res.status(500).send('500 Internal Server Error');
      }
    } 
    let tr;
    try {

      tr = await serv.getTestResultsRFID(db,rfid);
      return res.status(200).json(tr);
    } catch (err) {
      return res.status(500).send('500 Internal Server Error');
    } 
    
  });
  
  //GET /api/skuitems/:rfid/testResults/:id
  
  app.get('/api/skuitems/:rfid/testResults/:id', async (req,res) => {
    const rfid=req.params.rfid;
    const id=req.params.id;
    if(!Number.isInteger(parseInt(id))||!Number.isInteger(parseInt(rfid))) {
      return res.status(422).send("422: Unprocessable Entity");
      }
    try {
      const tr = await serv.getTestResultID(db,id,rfid);
      return res.status(200).json(tr);
    } catch (err) {
      if(err.err==404){
        return res.status(404).send("404: Not found");
      }
      else{
        return res.status(500).json({error: 'Internal Server Error'});
      }
     
    }
  });
  
  //POST /api/skuitems/testResult
  
  app.post('/api/skuitems/testResult',
  [check("rfid").exists().isNumeric().notEmpty(),
    check("idTestDescriptor").exists().isNumeric().notEmpty(), 
    check("Result").exists().notEmpty()],
   async (req,res) => {
    const rfid=req.body.rfid;
    const errors = validationResult(req);
    if (!errors.isEmpty()||!isValidDate(req.body.Date)||rfid.length!=32) {
        return res.status(422).send("422: Unprocessable Entity");
    }
    try {
      const skui = await SKUItem.getSKUItemByRFID(db,rfid);//da portare dentro funzione principale
    } catch (err) {
      if(err.err==404){
        return res.status(404).send('404 Not Found');
      }
      else{
        return res.status(503).send('503 Service Unavailable');
      }
    } 
    let tr = req.body;
    try{
      
      await serv.store(db,tr);
  
    }catch(err){
      return res.status(503).send('503 Service Unavailable');
    }
    return res.status(201).send('201 created');
  });
  
  //PUT  /api/skuitems/:rfid/testResult/:id
  
  app.put('/api/skuitems/:rfid/testResult/:id',
  [check("newIdTestDescriptor").exists().isNumeric(), 
    check("newResult").exists()],
   async (req,res) => {
   const id=req.params.id;
   const rfid=req.params.rfid;
   const errors = validationResult(req);
   if (!errors.isEmpty()||!isValidDate(req.body.newDate)||!Number.isInteger(parseInt(id))||!Number.isInteger(parseInt(rfid))) {
    return res.status(422).send("422: Unprocessable Entity");
  }
  try {
    const skui = await SKUItem.getSKUItemByRFID(db,rfid);//da portare dentro funzione principale
  } catch (err) {
    if(err.err==404){
      return res.status(404).send('404 Not Found');
    }
    else{
      return res.status(503).send('503 Service Unavailable');
    }
  } 
    const newTr = req.body;
    try{
      serv.update(db,id,rfid,newTr);
    }catch(err){
      return res.status(503).send('503 Service Unavailable');
    }
    return res.status(200).send('OK');
  });
  
  //DELETE /api/skuitems/:rfid/testResult/:id
  
  app.delete('/api/skuitems/:rfid/testResult/:id', async (req,res) => {// funziona ma non ritorna il risultato stampato
    const id = req.params.id;
    const rfid = req.params.rfid;
    if(!Number.isInteger(parseInt(id))||!Number.isInteger(parseInt(rfid))) {
      return res.status(422).send("422: Unprocessable Entity");
      }
    try{
      serv.delete(db,id,rfid);
    }catch(err){
      return res.status(503).send('503 Service Unavailable');
    }  
    return res.status(204).send('No Content');
  });
  


  }
