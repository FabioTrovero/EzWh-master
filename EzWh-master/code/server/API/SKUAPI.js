const dayjs = require('dayjs');
const sqlite = require('sqlite3');
const express = require('express');
const session = require('express-session');
const { check, oneOf, validationResult, body } = require("express-validator");
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const DB = require('../database/EzWh_Database');

const SKUController = require('../controller/SKUController');
const service = require('../services/SKUService')
const SKU = new SKUController();
const serv = new service(SKU);

const db = new DB('EzWh.db');

try {
  db.startConnection();
  //console.log('Start connection to Database...')
}
catch (err) {
  console.log('Error in connection to Database')
}

module.exports = function(app) {

/* ---- SKU ---- */

// GET: Return an array containing all SKUs and their test descriptors
app.get('/api/skus', async (req, res) => {
    try {
      const skuArray = await serv.getAllSKUs(db);
      res.status(200).json(skuArray);
    }
    catch (err) {
      res.status(500).send("500: Internal Server Error");
    }
});
  
// GET: Return an array containing information about the requested SKU
app.get('/api/skus/:id', async (req, res) => {
    if (!Number.isInteger(parseInt(req.params.id))) {
      res.status(422).send("422: ID not an int")
    }
    if(req.params.id<0){return res.status(422).send("422: ID not an int")}
    try {
      const skuArray = await serv.getSKUByIdServ(db, req.params.id);
      res.status(200).json(skuArray);
    }
    catch (err) {
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
        res.status(err).end();
      }
    }
});
  
// POST: Create a new SKU
app.post('/api/sku',
    [check("description").exists().isString().notEmpty(),
     check("weight").exists().isInt(),
     check("volume").exists().isInt(),
     check("notes").exists().isString().notEmpty(),
     check("price").exists().isNumeric(),
     check("availableQuantity").exists()],
    async(req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).send("422: Unprocessable Entity");
      }
      try {
        const data = {
          description: req.body.description,
          weight: req.body.weight,
          volume: req.body.volume,
          notes: req.body.notes,
          price: req.body.price,
          availableQuantity: req.body.availableQuantity
        }
        if(data.price<0 || data.weight<0 || data.volume <0 || data.availableQuantity<0 
          || !Number.isInteger(data.availableQuantity))
        {
          return res.status(422).send("422: Unprocessable Entity");
        }
        await serv.create(db, data);
        res.status(201).send("201: Created");
      }
      catch (err) {
        res.status(503).end("503: Service Unavailable");
      }
});
  
// PUT: Modify an existing SKU
app.put('/api/sku/:id',
    [check("newDescription").exists().isString(),
     check("newWeight").exists().isNumeric(),
     check("newVolume").exists().isNumeric(),
     check("newNotes").exists().isString(),
     check("newPrice").exists().isNumeric(),
     check("newAvailableQuantity").exists().isNumeric()],
    async(req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).send("422: Unprocessable Entity");
      }
      if (!Number.isInteger(parseInt(req.params.id))) {
        res.status(422).send("422: ID not an int")
      }
      try {
        const data = {
          newDescription: req.body.newDescription,
          newWeight: req.body.newWeight,
          newVolume: req.body.newVolume,
          newNotes: req.body.newNotes,
          newPrice: req.body.newPrice,
          newAvailableQuantity: req.body.newAvailableQuantity
        }
        if(data.newPrice<0 || data.newWeight<0 || data.newVolume <0 || data.newAvailableQuantity<0 
          || !Number.isInteger(data.newAvailableQuantity))
        {
          return res.status(422).send("422: Unprocessable Entity");
        }

        await serv.modify(db, data, req.params.id);
        res.status(200).send("200: Success");
      }
      catch (err) {
        if (err.err == 404) {
          res.status(404).end("404: Not found");
        }
        else if(err.err == 422){
          res.status(422).send("422: Unprocessable Entity");
        }
        else {
          res.status(503).end("503: Service Unavailable");
        }
      }
});
  
// PUT: Modify the position of an SKU
app.put('/api/sku/:id/position',
    [check("position").exists()],
    async(req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).send("422: Unprocessable Entity");
      }
      if (!Number.isInteger(parseInt(req.params.id))) {
        res.status(422).send("422: ID not an int")
      }
      try {
        const data = {
          position: req.body.position
        }
        await serv.modifyPosition(db, data, req.params.id);
        res.status(200).send("200: Success");
      }
      catch (err) {
        if (err.err == 404) {
          res.status(404).end("404: Not found");
        }
        else if (err.err == 422) {
          res.status(422).send("422: Unprocessable Entity");
        }
        else {
          res.status(503).end("503: Service Unavailable");
        }
      }
});
  
// DELETE: Delete an SKU
app.delete('/api/skus/:id', async(req, res) => {
    if (!Number.isInteger(parseInt(req.params.id))) {
      res.status(422).send("422: ID not an int")
    }
    try {
      await serv.delete(db, req.params.id);
      res.status(204).send("204: No Content");
    }
    catch (err) {
      if(err.err == 404){
        res.status(204).send("204: No Content");
      }
      if (err.err == 422) {
        res.status(422).send("422: Unprocessable Entity");
      }
      else {
        res.status(503).end("503: Service Unavailable");
      }
    }
});
}
