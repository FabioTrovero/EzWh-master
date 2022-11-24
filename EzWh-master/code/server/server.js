'use strict';
const dayjs = require('dayjs');
const sqlite = require('sqlite3');
const express = require('express');
const session = require('express-session');
const { check, oneOf, validationResult, body } = require("express-validator");
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const DB = require('./database/EzWh_Database');
const UserController=require("./controller/UserController")

const SKUController = require('./controller/SKUController');
const SKUItemController = require('./controller/SKUItemController');
const PositionController = require('./controller/positionController');

const us=new UserController()
// init express
const app = new express();
const port = 3001;

const SKU = new SKUController();
const SKUItem = new SKUItemController();
const position = new PositionController();


const db = new DB('EzWh.db');
function isValidStateRO(state){
  //Possible states: ISSUED, DELIVERY, DELIVERED, TESTED, COMPLETEDRETURN, COMPLETED
  if(state!=='ISSUED' && state!=='DELIVERY'&& state!=='DELIVERED'&& state!=='TESTED'
  && state!=='COMPLETEDRETURN'&& state!=='COMPLETED'){
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

/* function isValidDate(date) {
  if (date == null) {
    return true;
  }
  var regEx = /^\d{4}\/\d{2}\/\d{2}$/;
  var regEx2 = /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}$/;
  if (!date.match(regEx) && !date.match(regEx2)) {
    return false;
  }
  return true;
} */

function isValidDate(date){
  if(!(dayjs(date, 'YYYY/MM/DD HH:mm', true).isValid() 
  || dayjs(date, 'YYYY/MM/DD', true).isValid())){
    return false;
  }
  return true;  
}

app.use(express.json());


app.use(session({
  secret: 'justkeepthissecret',
  resave: true,
  saveUninitialized: true
}));

//GET /api/test
app.get('/api/hello', (req,res)=>{
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});


require("./API/userAPI.js")(app);
require("./API/testDescriptorAPI.js")(app);
require("./API/testResultAPI.js")(app);
require("./API/itemAPI")(app);
require("./API/internalOrderAPI")(app);
require("./API/restockOrderAPI")(app);
require("./API/returnOrderAPI")(app);
require("./API/SKUAPI")(app);
require("./API/SKUItemAPI")(app);
require("./API/positionAPI")(app);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
  /* try{
    db.startConnection();
    console.log('Start connection to Database...')
  }
  catch (err){
    console.log('Error in connection to Database')
  } */
});




module.exports = app;