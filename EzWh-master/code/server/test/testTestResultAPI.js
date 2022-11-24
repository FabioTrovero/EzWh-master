const chai = require('chai');
const chaiHttp = require('chai-http');
const testResultContreller =require("../controller/testResultController")
const DB = require('../database/EzWh_Database.js');
const tr0=new testResultContreller();
chai.use(chaiHttp);
chai.should();
const db = new DB('EzWh.db');
db.startConnection();
const app = require("../server.js");
var agent = chai.request.agent(app);
let rfid;

describe("POST /api/skuitems/testResult", function(){
    
    beforeEach(async () => {
        await tr0.resetTableTestResult(db);
    })
    
           
    it('api add new testResult', async function(){
        
     await agent.post("/api/skuitem").send( {
            RFID:"12345678901234567890123456789015",
            SKUId:1,
            DateOfStock:"2021/11/29 12:30"
        })
     await agent.get("/api/skuItems")
            .then(function(res){
                res.should.have.status(200);
                res.body.length.should.be.at.least(1);
                rfid=res.body[0].RFID;
            })

        let data={
        rfid:rfid,
        idTestDescriptor:2, 
        Date:"2022/11/28", 
        Result:true
        }
        let data2={
        rfid:rfid,
         idTestDescriptor:2, 
         Date:"2000/12/12", 
         Result:false
        }
        
            
            await agent.post("/api/skuitems/testResult")
            .send(data)
            .then(function(res){
                res.should.have.status(201);
               
            })
             await agent.post("/api/skuitems/testResult")
            .send(data2)
            .then(function(res){
                res.should.have.status(201);
              
            })
           await  agent.post("/api/skuitems/testResult")
            .send({})
            .then(function(res){
                res.should.have.status(422);
               
            })
        })
    })


describe("GET /api/skuitems/:rfid/testResults", function(){
    it('api get all testResult by rfid', function(done){
        agent.get("/api/skuitems/"+rfid+"/testResults")
        .then(function(res){
            res.should.have.status(200);
            res.body.length.should.equal(2);
            done();
        })
    })
})

describe("GET /api/skuitems/:rfid/testResults/:id", function(){
    it('api get testResult by id ', function(done){
        id=2;//id test result
            agent.get("/api/skuitems/"+rfid+"/testResults/"+id)
            .then(function(res){
                res.should.have.status(200);
                res.body.idTestDescriptor.should.equal(2);
                res.body.Date.should.equal("2000/12/12");
                res.body.Result.should.equal(false);
                done()
            })
        })
    })

describe("PUT /api/skuitems/:rfid/testResults/:id", function(){
    it('api edit testResult by id and rfid', function(done){
        let id=1;
                agent.put("/api/skuitems/"+rfid+"/testResult/"+id)
                .send({newIdTestDescriptor:2, newDate: "2020/11/18", newResult:false})
                .then(function(res){
                    res.should.have.status(200);
                    agent.get("/api/skuitems/"+rfid+"/testResults/"+id)
                    .then(function(res){
                        res.body.idTestDescriptor.should.equal(2);
                        res.body.Date.should.equal("2020/11/18");
                        res.body.Result.should.equal(false);
                        done();
                    })
                })
            })
        })
  

describe("DELETE /api/skuitems/:rfid/testResults/:id", function(){
    it('api delete testResult id and rfid', function(done){
        let id=1;
            agent.delete("/api/skuitems/"+rfid+"/testResult/"+id)
            .then(function(res){
                res.should.have.status(204);
                agent.get("/api/skuitems/"+rfid+"/testResults/"+id)
                .then(function(res){
                    res.should.have.status(404);
                    done()
                })
            })
        })
    })
