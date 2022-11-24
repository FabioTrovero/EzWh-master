const sqlite = require('sqlite3');
const express = require('express');
const { check, oneOf, validationResult, body } = require("express-validator");
const DB = require('../database/EzWh_Database.js');
const internalOrderC= require('../controller/internalOrderController')
const service = require('../services/internalOrderService');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);


const intO = new internalOrderC();
const db = new DB('EzWh.db');
const serv = new service(intO);

function isValidDate(date){
  if(!(dayjs(date, 'YYYY/MM/DD HH:mm', true).isValid() 
  || dayjs(date, 'YYYY/MM/DD', true).isValid())){
    return false;
  }
  return true;  
}
function isValidStateIO(state){
    //Possible states: ISSUED, ACCEPTED, REFUSED, CANCELED, COMPLETED
    if(state!=='ISSUED' && state!=='ACCEPTED'&& state!=='REFUSED'&& state!=='CANCELED'
    && state!=='COMPLETED'){
      return false;
    }
    return true;
  }
  function isValidDate(date){
    if(!(dayjs(date, 'YYYY/MM/DD HH:mm', true).isValid() 
    || dayjs(date, 'YYYY/MM/DD', true).isValid() || (dayjs(date, 'YYYY/MM/DD h:mm', true).isValid()))){
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
      // INTERNAL ORDER

app.get('/api/internalOrders', async (req,res) => {
    try {
      const internalOrder = await serv.getAllIntO(db);
      res.status(200).json(internalOrder);
    } catch (err) {
      res.status(500).send('Internal Server Error').end();
    }
  });
  
  
  app.get('/api/internalOrdersIssued', async (req,res) => {
    try {
      const internalOrder = await serv.getAllIntObyState(db,'ISSUED');
      res.status(200).json(internalOrder);
    } catch (err) {
      res.status(500).send('Internal Server Error').end();
    }
  });
  
  app.get('/api/internalOrdersAccepted', async (req,res) => {
    try {
      const internalOrder = await serv.getAllIntObyState(db,'ACCEPTED');
      res.status(200).json(internalOrder);
    } catch (err) {
      res.status(500).send('Internal Server Error').end();
    }
  });
  
  app.get('/api/internalOrders/:id', async (req,res) => {
    if (!Number.isInteger(parseInt(req.params.id))) {
      res.status(422).send("422: Unprocessable Entity");
    }
    try {
      let id = req.params.id;
      const internalOrder = await serv.getIntObyId(db,id);
      res.status(200).json(internalOrder);
    } catch (err) {
      if (err == 404) {
        res.status(404).send("404: Not Found");
      }
      else if (err == 422) {
        res.status(422).send("422: Unprocessable Entity");
      }
      else if (err == 500) {
        res.status(500).send("500: Internal Server Error");
      }
      else {
        res.status(500).end();
      }
    }
  });
  
  app.post('/api/internalOrders',
    [check("issueDate").exists().isString(),
     check("products").exists(),
     check("customerId").exists().isNumeric(),],
    async(req, res) => {
      const errors = validationResult(req);
      console.log('CHIAMATA API INTERNAL ORDERS')
      if (!errors.isEmpty()) {
        res.status(422).send("422: Unprocessable Entity");
      }
      if(req.body.products.length ===0){
        return res.status(422).json({error: `Validation of the Request body failed`});
      }
      if (Object.keys(req.body).length === 0) {
        return res.status(422).json({error: `Empty body request`});
      }
  
      if(!isValidDate(req.body.issueDate)){
        res.status(422).send("422: Unprocessable Entity");
      }
      try {
        
        const data = {
          issueDate: req.body.issueDate,
          products: req.body.products,
          customerId: req.body.customerId
        }
        for(let x of data.products){
          if(x.price<0 || data.customerId <0|| x.qty <0)
        {
          return res.status(422).send("422: Unprocessable Entity");
        }
        await serv.store(data,db);
        return res.status(201).send("201: Created");
      }
    }
      catch (err) {
        return res.status(503).end("503: Service Unavailable");
      }
  });
  
  
  app.put('/api/internalOrders/:id',
    [check("newState").exists()],
    async(req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).send("422: Unprocessable Entity");
      }
      if (!Number.isInteger(parseInt(req.params.id))) {
        res.status(422).send("422: Unprocessable Entity");
      }
      if (Object.keys(req.body).length === 0) {
        return res.status(422).json({error: `Empty body request`});
      }
      if(!isValidStateIO(req.body.newState)){
        res.status(422).send("422: Unprocessable Entity");
      }
      
        let id = req.params.id;
        if(id <0){
          res.status(422).send("422: Unprocessable Entity");
        }
        if(req.body.newState != 'COMPLETED'){
          try{
        const data = {
          newState: req.body.newState,
        }
        await serv.update(data,db,id);
        res.status(200).send("201: Created");
        }
        catch (err) {
          if (err == 404) {
            res.status(404).send("404: Not Found");
          }
          else if (err == 422) {
            res.status(422).send("422: Unprocessable Entity");
          }
          else if (err == 500) {
            res.status(500).send("500: Internal Server Error");
          }
          else {
            res.status(500).end();
          }
        }
      }
        else{
          try{
          if(req.body.products == undefined){
            res.status(422).send("422: Unprocessable Entity");
          }
          const data = ({
            newState: req.body.newState,
            products: req.body.products
          })
        await serv.update(data,db,id);
      
        res.status(200).send();
      }
      catch (err) {
        if (err == 404) {
          res.status(404).send("404: Not Found");
        }
        else if (err == 422) {
          res.status(422).send("422: Unprocessable Entity");
        }
        else if (err == 500) {
          res.status(500).send("500: Internal Server Error");
        }
        else {
          res.status(500).end();
        }
      }
    }
  });
  
  app.delete('/api/internalOrders/:id', async (req,res) => {
    
    if (!Number.isInteger(parseInt(req.params.id))) {
      res.status(422).send("422: Unprocessable Entity");
    }
    let id = req.params.id;
    if(id <0){
      res.status(422).send("422: Unprocessable Entity");
    }
  try{
    await serv.delete(db,id);
     return res.status(204).end();
  }
  catch (err) {
    if (err == 404) {
      res.status(422).send("404: Not Found");
    }
    else if (err == 422) {
      res.status(422).send("422: Unprocessable Entity");
    }
    else if (err == 500) {
      res.status(500).send("500: Internal Server Error");
    }
    else {
      res.status(500).end();
    }
  }
  
  });
  
  
  }