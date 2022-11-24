const dayjs = require('dayjs');
const sqlite = require('sqlite3');
const express = require('express');
const session = require('express-session');
const { check, oneOf, validationResult, body } = require("express-validator");
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const DB = require('../database/EzWh_Database');

const positionController = require('../controller/positionController');
const service = require('../services/positionService')
const position = new positionController();
const serv = new service(position);

const db = new DB('EzWh.db');

try {
  db.startConnection();
  //console.log('Start connection to Database...')
}
catch (err) {
  console.log('Error in connection to Database')
}

module.exports = function(app) {

/* ---- Positions ---- */
// GET: Return an array containing all positions
app.get('/api/positions', async (req, res) => {
    try {
      const positionsArray = await serv.getAllPositions(db);
      res.status(200).json(positionsArray);
    }
    catch (err) {
      if (err.err == 500) {
        res.status(500).send("500: Internal Server Error");
      }
      else {
        res.status(err).end();
      }
    }
});
  
// POST: Creates a new position
app.post('/api/position',
    [check("positionID").exists().isString(),
     check("aisleID").exists().isString(),
     check("row").exists().isString(),
     check("col").exists().isString(),
     check("maxWeight").exists().isNumeric(),
     check("maxVolume").exists().isNumeric()],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).send("422: Unprocessable Entity")
      }
      try {
        const data = {
          positionID: req.body.positionID,
          aisleID: req.body.aisleID,
          row: req.body.row,
          col: req.body.col,
          maxWeight: req.body.maxWeight,
          maxVolume: req.body.maxVolume 
        }

        if(data.positionID.length != 12 || data.aisleID.length !=4 ||
          data.row.length !=4 ||data.col.length !=4 )
          {
            
          res.status(422).send("422: Unprocessable Entity")

          }
          let newPositionID = data.aisleID + data.row + data.col;
          if(newPositionID != data.positionID)
        {
          res.status(422).send("422: Unprocessable Entity")

        }
        await serv.create(db, data);
        res.status(201).send("201: Created");
      }
      catch (err) {
        res.status(503).send("503: Service Unavailable");
      }
});
  
// PUT: Modify an existing position identified by a given positionID
app.put('/api/position/:positionID',
    [check("newAisleID").exists().isNumeric(),
     check("newRow").exists().isNumeric(),
     check("newCol").exists().isNumeric(),
     check("newMaxWeight").exists().isNumeric(),
     check("newMaxVolume").exists().isNumeric(),
     check("newOccupiedVolume").exists().isNumeric(),
     check("newOccupiedWeight").exists().isNumeric()],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty() || !Number.isInteger(parseInt(req.params.positionID))) {
        res.status(422).send("422: Unprocessable Entity");
      }
      try {
        
        let newPositionID = req.body.newAisleID + req.body.newRow + req.body.newCol;

        const data = {
          positionID: newPositionID,
          aisleID: req.body.newAisleID,
          row: req.body.newRow,
          col: req.body.newCol,
          maxWeight: req.body.newMaxWeight,
          maxVolume: req.body.newMaxVolume,
          occupiedWeight: req.body.newOccupiedWeight,
          occupiedVolume: req.body.newOccupiedVolume
        }
        if(data.positionID.length != 12 || data.aisleID.length !=4 ||
          data.row.length !=4 ||data.col.length !=4 )
          {
            
          res.status(422).send("422: Unprocessable Entity")

          }
        await serv.modify(db, data, req.params.positionID);
        res.status(200).send("200: Success");
      }
      catch (err) {
        if (err.err == 404) {
          res.status(404).send("404: Not Found");
        }
        else if(err.err == 422){
          res.status(422).send("422: Unprocessable Entity");
        }
        else {
          res.status(503).send("503: Service Unavailable");
        }
      }
});
  
// PUT: Modify the positionID of a position, given its current positionID
app.put('/api/position/:positionID/changeID',
    [check("newPositionID").exists().isNumeric()],
    async(req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty() || !Number.isInteger(parseInt(req.params.positionID))) {
        res.status(422).send("422: Unprocessable Entity");
      }
      try {
        let newPositionID = req.body.newPositionID;
        let newAisleID = newPositionID.slice(0, 4);
        let newRow = newPositionID.slice(4, 8);
        let newCol = newPositionID.slice(8);
        const data = {
          positionID: newPositionID,
          aisleID: newAisleID,
          row: newRow,
          col: newCol
        }
        

        if(data.positionID.length != 12 || data.aisleID.length !=4 ||
          data.row.length !=4 ||data.col.length !=4 )
          {
            
          return res.status(422).send("422: Unprocessable Entity")

          }
        await serv.modifyPositionId(db, data, req.params.positionID);
        res.status(200).send("200: Success");
      }
      catch (err) {
        if (err.err == 404) {
          res.status(404).send("404: Not Found");
        }
        if (err.err == 422) {
          res.status(422).send("404: Not Found");
        }
        else if (err.err == 503) {
          res.status(503).send("503: Service Unavailable");
        }
      }
});
  
// DELETE: Deletes an SKU Item given its position ID
app.delete('/api/position/:positionID', async (req, res) => {
    if (!Number.isInteger(parseInt(req.params.positionID))) {
      res.status(422).send("422: Unprocessable Entity");
    }
    try {
      await serv.delete(db, req.params.positionID);
      res.status(204).send("204: No Content");
    }
    catch (err) {
      if (err.err == 404) {
        res.status(422).send("422");
      }
      if (err.err == 422) {
        res.status(422).send("422");
      }

      res.status(503).send("503: Service Unavailable");
    }
});
}