const dayjs = require('dayjs');
const sqlite = require('sqlite3');
const express = require('express');
const session = require('express-session');
const { check, oneOf, validationResult, body } = require("express-validator");
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const DB = require('../database/EzWh_Database');

const SKUItemController = require('../controller/SKUItemController');
const service = require('../services/SKUItemService')
const SKUItem = new SKUItemController();
const serv = new service(SKUItem);

const db = new DB('EzWh.db');

try {
  db.startConnection();
  //console.log('Start connection to Database...')
}
catch (err) {
  console.log('Error in connection to Database')
}

function isValidDate(date){
    if(!(dayjs(date, 'YYYY/MM/DD HH:mm', true).isValid() 
    || dayjs(date, 'YYYY/MM/DD', true).isValid())){
      return false;
    }
    return true;  
  }

module.exports = function(app) {

/* ---- SKU Items ---- */
// GET: Return an array containing all SKU Items
app.get('/api/skuitems', async (req, res) => {
    try {
      const skuItemsArray = await serv.getAllSKUItems(db);
      return res.status(200).json(skuItemsArray);
    }
    catch (err) {
      if (err.err == 500) {
        return  res.status(500).send("500: Internal Server Error");
      }
      else {
        return  res.status(err).end();
      }
    }
});
  
// GET: Return an array containing all available SKU Items with a determined skuid
app.get('/api/skuitems/sku/:id', async(req, res) => {
    if (!Number.isInteger(parseInt(req.params.id))) {
      return res.status(422).send("422: Unprocessable Entity");
    }
    try {
      const skuItemsArray = await serv.getAvailableSKUItemsBySKUIdServ(db, req.params.id);
      return res.status(200).json(skuItemsArray);
    }
    catch (err) {
      if (err.err == 404) {
        return  res.status(404).send("404: Not Found");
      }
      else if (err.err == 422) {
        return  res.status(422).send("422: Unprocessable Entity");
      }
      else if (err.err == 500) {
        return res.status(500).send("500: Internal Server Error");
      }
      else {
        return  res.status(err).end();
      }
    }
});
  
// GET: Return an SKU Item given its RFID
app.get('/api/skuitems/:rfid', async(req, res) => {
    if (!Number.isInteger(parseInt(req.params.rfid))) {
      return res.status(422).send("422: Unprocessable Entity");
    }
    try {
      const skuItemsArray = await serv.getItemByRFID(db, req.params.rfid);
      return  res.status(200).json(skuItemsArray);
    }
    catch (err) {
      if (err.err == 404) {
        return  res.status(404).send("404: Not Found");
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
  
// POST: Creates a new SKU Item with available = 0
app.post('/api/skuitem',
    [check("RFID").exists().isString(),
     check("SKUId").exists().isNumeric()],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).send("422: Unprocessable Entity");
      }
      if (!isValidDate(req.body.DateOfStock)) {
        return res.status(422).send("422: Unprocessable Entity");
      }
      
      try {
        const data = {
          RFID: req.body.RFID,
          SKUId: req.body.SKUId,
          DateOfStock: req.body.DateOfStock
        }
        if(data.SKUId<0 || data.RFID.length != 32){res.status(422).send("422: Unprocessable Entity");}
        await serv.create(db, data);
        
        return  res.status(201).send("201: Created");
      }
      catch (err) {
        if (err.err == 404) {
          return  res.status(404).send("404: Not Found");
        }
        else if (err.err == 503) {
          return  res.status(503).send("503: Service Unavailable");
        }
      }
});
  
// PUT: Modify RFID, available and/or date of stock fields of an existing SKU Item
app.put('/api/skuitems/:rfid',
    [check("newRFID").exists().notEmpty(),
     check("newAvailable").exists().notEmpty()],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty() || !Number.isInteger(parseInt(req.params.rfid))) {
        return res.status(422).send("422: Unprocessable Entity");
      }
      if (!isValidDate(req.body.newDateOfStock)) {
        return res.status(422).send("422: Unprocessable Entity");
      }
      try {
        const data = {
          RFID: req.body.newRFID,
          Available: req.body.newAvailable,
          DateOfStock: req.body.newDateOfStock
        }
        if(data.Available<0||!Number.isInteger(parseInt(data.RFID))||data.RFID.length != 32){res.status(422).send("422: Unprocessable Entity");}
        await serv.modify(db, data, req.params.rfid);
        return res.status(200).send("200: Success");
      }
      catch (err) {
        if (err.err == 404) {
          return res.status(404).send("404: Not Found");
        }
        if (err.err == 422) {
          return res.status(422).send("422: Unprocessable Entity");
        }
        else if (err.err == 503) {
          return res.status(503).send("503: Service Unavailable");
        }
      }
});
  
// DELETE: Delete SKU Item with a determined rfid
app.delete('/api/skuitems/:rfid', async (req, res) => {
    if (!Number.isInteger(parseInt(req.params.rfid))) {
      return res.status(422).send("422: Unprocessable Entity");
    }
    try {
      await serv.delete(db, req.params.rfid);
      return  res.status(204).send("204: No Content");
    }
    catch (err) {
      if (err.err == 404) {
        return  res.status(204).send("404: Not Found");
      }
      if (err.err == 422) {
        return  res.status(422).send("422: Unprocessable Entity");
      }
      else {
        return  res.status(503).send("503: Service Unavailable");
      }
    }
});
}