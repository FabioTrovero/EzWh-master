const sqlite = require('sqlite3');
const express = require('express');
const { check, oneOf, validationResult, body } = require("express-validator");
const DB = require('../database/EzWh_Database.js');
const Item = require('../controller/ItemController');
const service = require('../services/itemService')
const SKUController = require('../controller/SKUController');
const SKU = new SKUController();




const db = new DB('EzWh.db');
const item = new Item();
const serv = new service(item);

try{
    db.startConnection();
    //console.log('Start connection to Database...')
  }
  catch (err){
    console.log('Error in connection to Database')
  }

module.exports=function(app){
      //ITEM
app.post('/api/item',[check("id").exists().isNumeric(),
check("description").exists().isString(),
check("price").exists().isNumeric(),
check("SKUId").exists().isNumeric(),
check("supplierId").exists().isNumeric()], async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send("422: Unprocessable Entity");
  }
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({error: `Empty body request`});
  }

  const data = {
    id: req.body.id,
    description: req.body.description,
    price : req.body.price,
    SKUId: req.body.SKUId,
    supplierId : req.body.supplierId
  }
  if(data.id < 0 || data.SKUId < 0 || data.price < 0 || data.supplierId < 0)
  {
    return res.status(422).send("422: Unprocessable Entity");

  }
  try{
    try{
       let x = await SKU.getSKUById(db,data.SKUId);
    }
    catch(err){
      res.status(404).send("404: Not Found").end();
    }
    try{

      await serv.getItem(db, data.id, data.supplierId);
      throw {err: 422};
    }
    catch(err){

      if(err.err == 404){
        try{
          await serv.store(db,data);
          return res.status(201).end();

        }
        catch(err){
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
            return res.status(500).end();
          }
        }
      }
      else{
        return res.status(422).end()}
    }

  }
  catch(err){
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

app.put('/api/item/:id/:supplierId',[
check("newDescription").exists().isString(),
check("newPrice").exists().isNumeric()], async (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).send("422: Unprocessable Entity");
  }
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({error: `Empty body request`});
  }
  if (!Number.isInteger(parseInt(req.params.id)) || !Number.isInteger(parseInt(req.params.supplierId))) {
    res.status(422).send("422: Unprocessable Entity");
  }
  const data = {
    newDescription: req.body.newDescription,
    newPrice : req.body.newPrice,
    id : req.params.id,
    supplierId : req.params.supplierId
  }
  if(data.id < 0 || data.newPrice < 0 || data.supplierId < 0)
  {
    return res.status(422).send("422: Unprocessable Entity");

  }

  
  try{
    await serv.update(db,data);
    return res.status(200).end();

  }
  catch(err){
    if (err.err == 404) {
    res.status(404).send("404: Not Found");
  }
  else if (err.err == 422) {
    res.status(422).send("422: Unprocessable Entity");
  }
  else if (err.err == 500) {
    res.status(500).send("500: Internal Server Error");
  }
  else {
    res.status(500).end();
  }
}
  
});


 app.get('/api/items', async (req,res) => {
  try {
    
    const itemList = await serv.getAllItem(db);
    res.status(200).json(itemList);
  } 
  catch(err){res.status(500).send("500: Internal Server Error").end();}
}); 

app.get('/api/items/:id/:supplierId', async (req,res) => {
  if (!Number.isInteger(parseInt(req.params.id)) || !Number.isInteger(parseInt(req.params.supplierId))) {
    res.status(422).send("422: Unprocessable Entity");
  }
  let id = req.params.id;
  let supplierId = req.params.supplierId;
  if(id < 0 || supplierId < 0) {
    return res.status(422).send("422: Unprocessable Entity");
  }
  try {
    const itemList = await serv.getItem(db, id, supplierId);
    return res.status(200).json(itemList);
  } 
  catch (err) {
    console.log('ERRORE'+err.err)
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
      return res.status(500).end();
    }
  }
});

app.delete('/api/items/:id/:supplierId', async (req,res) => {
  if (!Number.isInteger(parseInt(req.params.id)) || !Number.isInteger(parseInt(req.params.supplierId))) {
    res.status(422).send("422: Unprocessable Entity");
  }
  let id = req.params.id;
  let supplierId = req.params.supplierId;
  if(id < 0 || supplierId < 0)
  {
    return res.status(422).send("422: Unprocessable Entity");

  }
  try{
     await item.getStoreItembyID(db, id, supplierId);
  }
  catch(err){
    res.status(422).send("404: Not Found").end();
  }
  try{
    await serv.delete(db, id, supplierId);
    return res.status(204).end();

  }

  catch(err){res.status(503).send("503: Service Unavaible");}
});

  }