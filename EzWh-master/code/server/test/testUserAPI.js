const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
const userController= require('../controller/UserController')
const DB = require('../database/EzWh_Database.js');
const db = new DB('EzWh.db');
const us0 = new userController();

const app = require("../server.js");
var agent = chai.request.agent(app);
try{
    db.startConnection();
    //console.log('Start connection to Database...')
  }
  catch (err){
    console.log('Error in connection to Database')
  }

describe("POST /api/newUser", function(){

    beforeEach(async () => {
        await us0.resetTableUser(db);
    })

    it('api add new user',async function(){
        
        data={

        username:"test@ezwh.it", 
        name:"francesco", 
        surname:"benedetto", 
        password:"testpassword", 
        type:"manager"
    }
    data1={
            
        username:"test1@ezwh.it", 
        name:"francesco", 
        surname:"benedetto", 
        password:"testpassword", 
        type:"customer"
    }
    data2={
            
        username:"test2@ezwh.it", 
        name:"francesco", 
        surname:"benedetto", 
        password:"testpassword", 
        type:"supplier"
    }
    data3={
            
        username:"test3@ezwh.it", 
        name:"francesco", 
        surname:"benedetto", 
        password:"testpassword", 
        type:"clerk"
    }
    data4={
            
        username:"test4@ezwh.it", 
        name:"francesco", 
        surname:"benedetto", 
        password:"testpassword", 
        type:"qualityEmployee"
    }
    data5={
            
        username:"test5@ezwh.it", 
        name:"francesco", 
        surname:"benedetto", 
        password:"testpassword", 
        type:"deliveryEmployee"
    }
    await agent.post("/api/newUser")
        .send(data)
        .then(function(res){
            res.should.have.status(201);
            
        })

        await agent.post("/api/newUser")
        .send(data1)
        .then(function(res){
            res.should.have.status(201);
            
        })
        await agent.post("/api/newUser")
        .send(data2)
        .then(function(res){
            res.should.have.status(201);
            
        })
        await agent.post("/api/newUser")
        .send(data3)
        .then(function(res){
            res.should.have.status(201);
            
        })
        await agent.post("/api/newUser")
        .send(data4)
        .then(function(res){
            res.should.have.status(201);
            
        })
        await agent.post("/api/newUser")
        .send(data5)
        .then(function(res){
            res.should.have.status(201);
            
        })
    })
})

describe("GET /api/users", function(){
    it('api get users without managers', function(done){
        agent.get("/api/users")
        .then(function(res){
            res.should.have.status(200);
            let email=[]
            res.body.map((x)=>{email.push(x.email)})
            let type=[]
            res.body.map((x)=>{type.push(x.type)})
            type.should.not.contain("manager")
            email.should.contain("test1@ezwh.it")
            done();
        })
    })
})

describe("GET /api/suppliers", function(){
    it('api get users of type suppliers', function(done){
        agent.get("/api/suppliers")
        .then(function(res){
            res.should.have.status(200);
            res.body.length.should.equal(1);
            done();
        })
    })
})

describe("GET /api/userinfo", function(){
    it('api get  data of user logged in ', function(done){
        agent.get("/api/userinfo")
        .then(function(res){
            console.log(res.status);
            res.should.have.status(200);
            done();
        })
    })
})

describe("POST /api/managerSession", function(){
    it('api login manager', function(done){
        agent.post("/api/managerSessions")
        .send({username:"test@ezwh.it", password:"testpassword"})
        .then(function(res){
            res.should.have.status(200);
            res.body.username.should.equal("test@ezwh.it");
            done();
        })
    })
})

describe("POST /api/customerSessions", function(){
    it('api login customer', function(done){
        agent.post("/api/customerSessions")
        .send({username:"test1@ezwh.it", password:"testpassword"})
        .then(function(res){
            res.should.have.status(200);
            res.body.username.should.equal("test1@ezwh.it");
            done();
        })
    })
})

describe("POST /api/supplierSessions", function(){
    it('api login supplier', function(done){
        agent.post("/api/supplierSessions")
        .send({username:"test2@ezwh.it", password:"testpassword"})
        .then(function(res){
            res.should.have.status(200);
            res.body.username.should.equal("test2@ezwh.it");
            done();
        })
    })
})

describe("POST /api/clerkSessions", function(){
    it('api login clerk', function(done){
        agent.post("/api/clerkSessions")
        .send({username:"test3@ezwh.it", password:"testpassword"})
        .then(function(res){
            res.should.have.status(200);
            res.body.username.should.equal("test3@ezwh.it");
            done();
        })
    })
})

describe("POST /api/qualityEmployeeSessions", function(){
    it('api login quality employee', function(done){
        agent.post("/api/qualityEmployeeSessions")
        .send({username:"test4@ezwh.it", password:"testpassword"})
        .then(function(res){
            res.should.have.status(200);
            res.body.username.should.equal("test4@ezwh.it");
            done();
        })
    })
})

describe("POST /api/deliveryEmployeeSessions", function(){
    it('api login delivery employee', function(done){
        agent.post("/api/deliveryEmployeeSessions")
        .send({username:"test5@ezwh.it", password:"testpassword"})
        .then(function(res){
            res.should.have.status(200);
            res.body.username.should.equal("test5@ezwh.it");
            done();
        })
    })
})

describe("POST /api/logout", function(){
    it('api logout user', function(done){
        agent.post("/api/logout")
        .then(function(res){
            res.should.have.status(200);
            done();
        })
    })
})

describe("PUT /api/users/:username", function(){
    it('api edit user', function(done){
        agent.put("/api/users/test5@ezwh.it")
        .send({oldType:"deliveryEmployee", newType:"customer"})
        .then(function(res){
            res.should.have.status(200);
            agent.get("/api/users")
            .then(function(res){
                res.should.have.status(200);
                emails=[]
                res.body.map((x)=>{emails.push(x.email)})
                emails.should.contain("test5@ezwh.it")
                for(let user of res.body){
                    if(user.email==="test5@ezwh.it"){
                        user.type.should.equal("customer");
                    }
                }
                done();
            })
        })
    })
})

describe("DELETE /api/users/:username/:type", function(){
    it('api delete user', function(done){
        agent.delete("/api/users/lucaardito@ezwh.it/supplier")
        .then(function(res){
            res.should.have.status(204);
            agent.get("/api/users")
            .then(function(res){
                res.should.have.status(200);
                for(let user of res.body){
                    if(user.email=="lucaardito@ezwh.it"){
                        user.type.should.not.equal("supplier");
                    }
                }
                done();
            })
        })
    })
})