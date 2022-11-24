const sqlite = require('sqlite3');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const express = require('express');
const { check, oneOf, validationResult, body } = require("express-validator");
const DB = require('../database/EzWh_Database.js');
const restockOrderC= require('../controller/restockOrderController')
const service = require('../services/restockOrderService');



const resO = new restockOrderC();
const db = new DB('EzWh.db');
const serv = new service(resO);
function isValidDate(date){
  if(!(dayjs(date, 'YYYY/MM/DD HH:mm', true).isValid() 
  || dayjs(date, 'YYYY/MM/DD', true).isValid())){
    return false;
  }
  return true;  
}

function isValidStateRO(state){
    //Possible states: ISSUED, DELIVERY, DELIVERED, TESTED, COMPLETEDRETURN, COMPLETED
    if(state!=='ISSUED' && state!=='DELIVERY'&& state!=='DELIVERED'&& state!=='TESTED'
    && state!=='COMPLETEDRETURN'&& state!=='COMPLETED'){
      return false;
    }
    return true;
  }

  try{
    db.startConnection();
    //console.log('Start connection to Database...')
  }
  catch (err){
    console.log('Error in connection to Database')
  }
  
module.exports=function(app){
    //   RESTOCK ORDER API

app.get('/api/restockOrders', async (req,res) => {
    try {
      const orderList = await serv.getAllresO(db);
      return res.status(200).json(orderList);
    } catch (err) {
      console.log(err);
      return res.status(500).send('Internal Server Error');
    }
  });
  
  
  app.get('/api/restockOrdersIssued', async (req,res) => {
    try {
      const userlist = await serv.getresObyState(db,'ISSUED');
      return res.status(200).json(userlist);
    } 
      catch (err) {
        if (err.err == 404) {
          return res.status(404).send("404: Not Found");
        }
        else if (err.err == 422) {
          return res.status(422).send("422: Unprocessable Entity");
        }
        else if (err.err == 500) {
          return res.status(500).send("500: Internal Server Error");
        }
        else {
          return res.status(err).end();
        }
      }
  });
  
  app.get('/api/restockOrders/:id', async (req,res) => {
    if (!Number.isInteger(parseInt(req.params.id))) {
      return res.status(422).send("422: Unprocessable Entity");
    }
    try {
      let id = req.params.id;
      const userlist = await serv.getResObyId(db,id);
      return res.status(200).json(userlist);
    } catch (err) {
      if (err.err == 404) {
        return res.status(404).send("404: Not Found");
      }
      else if (err.err == 422) {
        return res.status(422).send("422: Unprocessable Entity");
      }
      else if (err.err == 500) {
        return res.status(500).send("500: Internal Server Error");
      }
      else {
        return res.status(err).end();
      }
    }
  });
  
  app.get('/api/restockOrders/:id/returnItems', async (req,res) => {
    if (!Number.isInteger(parseInt(req.params.id))) {
      return res.status(422).send("422: Unprocessable Entity");
    }
  
    try {
      let id = req.params.id;
      try{
  
        let x = await serv.getResObyId(db,id);
    }
    catch(err){
      console.log(err);
      res.status(404).send("404: Not Found");
    }
      const items = await serv.getItems(db,id);
      return res.status(200).json(items);
    } catch (err) {
      if (err.err == 404) {
        return res.status(404).send("404: Not Found");
      }
      else if (err.err == 422) {
        return res.status(422).send("422: Unprocessable Entity");
      }
      else if (err.err == 500) {
        return res.status(500).send("500: Internal Server Error");
      }
      else {
        return res.status(err).end();
      }
    }
  });
  
  
  app.post('/api/restockOrder',
            [check("issueDate").exists(),
            check("products").exists(),
            check("supplierId").exists().isNumeric(),],
             async (req,res) => {
    
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).send("422: Unprocessable Entity");
      }
    if (Object.keys(req.body).length === 0) {
      return res.status(422).send('422: Unprocessable Entity');
    }
    if(!isValidDate(req.body.issueDate)){
      return res.status(422).send("422: Unprocessable Entity");
    }
    let orders = req.body;
    try{
      await serv.store(orders,db);
      return res.status(201).end();
  
    }
    catch(err){
      if(err.err == 404|| err.err == 422){
        return res.status(422).end("422: Unprocessable Entity");}
        else{
         return res.status(503).end("503: Service Unavailable");
        }
    }
  });
  
  
  
  app.put('/api/restockOrder/:id',[check("newState").exists(),], async (req,res) => {
    if (!Number.isInteger(parseInt(req.params.id))) {
      return res.status(422).send("422: Unprocessable Entity");
    }
  
    const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).send("422: Unprocessable Entity");
      }
    
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({error: `Empty body request`});
    }
    let id = req.params.id;
   
    let state = req.body.newState;
    
    if(!isValidStateRO(state)){
      return res.status(422).send("422: Unprocessable Entity");
    }
    else{
      
      try{
      await serv.updateState(db,id,state);
      return res.status(200).end();
    }
    catch(err){
      if(err.err == 404){
        return res.status(404).end("404: Not Found");}
        else{
          return res.status(503).end("503: Service Unavailable");
        }
    }
    }
  });
  
  
  app.put('/api/restockOrder/:id/skuItems',[check("skuItems").exists(),], async (req,res) => {
    
    if (!Number.isInteger(parseInt(req.params.id))) {
      return res.status(422).send("422: Unprocessable Entity");
    }
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).send("422: Unprocessable Entity");
    }
  
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({error: `Empty body request`});
    }
    let id = req.params.id;
    let items = req.body.skuItems;
    try{
      await serv.updateItems(db,id,items);
      return res.status(200).end();
    }
    catch(err){
      if(err.err == 404){
        return res.status(404).send()
        
      }
      if(err == 422){
        return res.status(422).send()
        
      }
      else{return res.status(503).end("503: Service Unavailable");}
    }
  
  });
  
  app.put('/api/restockOrder/:id/transportNote',[check("transportNote").exists().isString().notEmpty(),], async (req,res) => {
    if (!Number.isInteger(parseInt(req.params.id))) {
      return res.status(422).send("422: Unprocessable Entity");
    }
  
    if (Object.keys(req.body).length === 0) {
      return res.status(422).json({error: `Empty body request`});
    }
    let id = req.params.id;
    let tn = req.body.transportNote;

    if(isValidDate(tn.deliveryDate))
    try{

      let ro =  await serv.getResObyId(db,id);

      if(dayjs(ro.issueDate).isAfter(dayjs(tn.deliveryDate)))
      {
        return res.status(422).send("422: Unprocessable Entity");
      }

      await serv.updateTN(db,id,JSON.stringify(tn.deliveryDate))
      
      return res.status(200).end();
  
    }
    catch(err){
      if(err.err == 404){
        return res.status(404).end("404: Not Found");}
        else if(err == 422){
        return  res.status(422).end();}
        else{
        return  res.status(503).end("503: Service Unavailable");
        }
    }
  
  });
  
  
  app.delete('/api/restockOrder/:id', async (req,res) => {
    if (!Number.isInteger(parseInt(req.params.id))) {
      res.status(422).send("422: Unprocessable Entity");
    }
  
    try{
  
      let id = req.params.id;
      await serv.delete(db,id)
  
      return res.status(204).end();
    }
    catch(err){
      if(err == 404){
        res.status(422).end("404: Not Found");}
        else{
          res.status(503).end("503: Service Unavailable");
        }
    }
    
  });
  

}