const chai = require('chai');
const chaiHttp = require('chai-http');
const testDescriptorController =require("../controller/testDescriptorController")
const SKU =require("../controller/SKUController")

const DB = require('../database/EzWh_Database.js');
const td0=new testDescriptorController();
const sku=new SKU();
chai.use(chaiHttp);
chai.should();
const db = new DB('EzWh.db');
db.startConnection();
const app = require("../server.js");
var agent = chai.request.agent(app);



describe("POST /api/testDescriptor", function(){

    beforeEach(async () => {
        await td0.resetTableTestDescriptor(db);
        await sku.resetTable(db);
    })

    it('api add a new testDescriptor',async function(){
        let data={
            name:"testDescriptor1",
            procedureDescription:"HopeToPassTheTest",
            idSKU:1
        }
        let data1={
            name:"testDescriptor2",
            procedureDescription:"HopeToPassTheTest2",
            idSKU:2
        }
        const sku1 = {description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };
        const sku2 = {description: "description 2", weight: 30, volume: 40, notes: "notes 2", price: 100.99, availableQuantity: 10 };

            await agent.post('/api/sku')
            .send(sku1);

            await agent.post('/api/sku')
            .send(sku2);

            await agent.post("/api/testDescriptor")
            .send(data)
            .then(function(res){
                res.should.have.status(201);
                
            })
            await agent.post("/api/testDescriptor")
            .send({})
            .then(function(res){
                res.should.have.status(422);
            })
            await agent.post("/api/testDescriptor")
            .send(data1)
            .then(function(res){
                res.should.have.status(201);
            })
        })
    })



describe("GET /api/testDescriptors", function(){
   


    it('api get all test descriptors', function(done){
        agent.get("/api/testDescriptors")
        .then(function(res){
            res.should.have.status(200);
            td=[]
            res.body.map((x)=>{td.push(x.name)})
            td.should.contain("testDescriptor1");
            td.should.contain("testDescriptor2");
            done();
        })
        
    })
})

describe("GET /api/testDescriptors/:id", function(){

    
    it('api get testDescriptor by id', function(done){
       id=1;//id related to testDescriptor1
       id2=2;
            agent.get("/api/testDescriptors/"+id)
            .then(function(res){
                res.should.have.status(200);
                res.body.name.should.equal("testDescriptor1");
                res.body.procedureDescription.should.equal("HopeToPassTheTest");
                res.body.idSKU.should.equal(1);
                
            })

            agent.get("/api/testDescriptors/"+id2)
            .then(function(res){
                res.should.have.status(200);
                res.body.name.should.equal("testDescriptor2");
                res.body.procedureDescription.should.equal("HopeToPassTheTest2");
                res.body.idSKU.should.equal(2);
                done();
            })
            
        })
        
    })


describe("PUT /api/testDescriptors/:id", function(){

   

    it('api edit testDescriptor by id', function(done){
        id=1;
            agent.put("/api/testDescriptor/"+id)
            .send({newName:"TestPutTestDescriptor", newProcedureDescription:"HopeToPassTheTestPlis", newIdSKU:2})
            .then(function(res){
                res.should.have.status(200);
                agent.get("/api/testDescriptors/"+id)
                .then(function(res){
                    res.should.have.status(200);
                    res.body.name.should.equal("TestPutTestDescriptor");
                    res.body.procedureDescription.should.equal("HopeToPassTheTestPlis");
                    res.body.idSKU.should.equal(2);
                    done();
                })
                
            })
            
        })
        
    })


describe("DELETE /api/testDescriptors/:id", function(){
   
    it('api delete testDescriptor by id', function(done){
       id=1;
            agent.delete("/api/testDescriptor/"+id)
            .then(function(res){
                res.should.have.status(204);
                agent.get("/api/testDescriptors/"+id)
                .then(function(res){
                    res.should.have.status(404);
                    done();
                })
                
            })
            
        })
        
    })
