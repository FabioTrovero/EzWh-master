const sqlite = require('sqlite3');
const express = require('express');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const { check, oneOf, validationResult, body } = require("express-validator");
const DB = require('../database/EzWh_Database.js');
const returnOrderC= require('../controller/returnOrderController')
const resO= require('../controller/restockOrderController')
const service = require('../services/returnOrderService');
const service2 = require('../services/restockOrderService');

const reso = new resO();
const serv2  = new service2(reso);
const db = new DB('EzWh.db');
const retO = new returnOrderC();
const serv = new service(retO);
function isValidDate(date){
  if(!(dayjs(date, 'YYYY/MM/DD HH:mm', true).isValid() 
  || dayjs(date, 'YYYY/MM/DD', true).isValid())){
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
    //RETURN ORDER

app.get('/api/returnOrders', async (req,res) => {
    try {
      const retOrders = await serv.getAllretO(db);
      res.status(200).json(retOrders);
    } catch (err) {
      res.status(500).send('500 Internal Server Error').end();
    }
  });
  
  app.get('/api/returnOrders/:id', async (req,res) => {
    
    if (!Number.isInteger(parseInt(req.params.id))) {
      res.status(422).send("422: Unprocessable Entity");
    }
  try {
      let id = req.params.id;
      const retOrder = await serv.getRetObyId(db,id);
      res.status(200).json(retOrder);
    } catch (err) {
      console.log(err)
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
        res.status(err).end();
      }
    }
  });
  
  app.post('/api/returnOrder',
    [check("returnDate").exists().isString(),
     check("products").exists(),
     check("restockOrderId").exists().isNumeric(),],
    async(req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).send("422: Unprocessable Entity");}
        if (Object.keys(req.body).length === 0) {
          return res.status(422).json({error: `Empty body request`});
        }
      
  
      if(!isValidDate(req.body.returnDate)){
        return res.status(422).send("422: Unprocessable Entity");
      }
      const data = {
        returnDate: req.body.returnDate,
        products: req.body.products,
        restockOrderId: req.body.restockOrderId
      }
      
      for(let x of data.products){
        if(x.price<0 || data.restockOrderId <0)
      {
        return res.status(422).send("422: Unprocessable Entity");
      }
        if((isNaN(parseInt(x.RFID))))
        {
          return res.status(422).send("422: Unprocessable Entity");
        }
      }
      try {
        try{
          
          await serv2.getResObyId(db,data.restockOrderId);
        }
        catch(err){
          return res.status(404).send("404: Not Found");
        }
        await serv.store(data,db)
        return res.status(201).send("201: Created");
      }
      catch (err) {
        console.log(err);
        if(err == 404){
          return  res.status(404).send("503: Service Unavailable");
        }
        else{

          return res.status(503).send("503: Service Unavailable");
        }
      }
  });
  
  app.delete('/api/returnOrder/:id', async (req,res) => {
    if (!Number.isInteger(parseInt(req.params.id))) {
      res.status(422).send("422: Unprocessable Entity");
    }
  
  
    let id = req.params.id;
    try{
      await retO.deleteReturnOrderbyId(id,db);
      return res.status(204).end();
  
    }
    catch(err){
      if (err == 404) {
        return res.status(422).send("404: Not Found");
    }
    else if (err == 422) {
      return res.status(422).send("422: Unprocessable Entity");
    }
    else if (err == 500) {
      return res.status(500).send("500: Internal Server Error");
    }
    else {
      return res.status(err).end();
    }}
  });
  
  
}