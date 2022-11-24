'use strict'
const Controller = require('../controller/UserController');
const DB = require('../database/EzWh_Database.js');
const User = require('../classes/user');

const dao  = new Controller();
const db = new DB('EzWh.db');

db.startConnection();


describe('test get All Users except managers',()=>{
    let usList = [];
    let data  =  {
            ID:1,
            name:"Francesco",
            surname:"Bergoglio",
            username:"pope@user1.ezwh.com",
            type:"customer",
            password:"testpassword"
        
    }

    usList.push(data);

    let data1  =  {
        ID:2,
        name:"John",
        surname:"Snow",
        username:"john.snow@supplier.ezwh.com",
        type:"supplier",
        password:"testpassword"
    }
    usList.push(data1);

    beforeAll(async () =>{
        await dao.resetTableUser(db);
        await dao.storeUser(db,data);
        await dao.storeUser(db,data1);
    })

    afterAll(async()=>{
        await dao.addDefaultUsers(db);
    })
    

    testUser(usList);


    function testUser(usList){

        test('test get All Users except managers', async()=>{
            let res = await dao.getStoredUsersNoManager(db);

            expect(res.length).toStrictEqual(usList.length);

            for(let i=0;i<usList.length;i++){
                compareUser(res[i],usList[i]);
                expect(res[i].type).toStrictEqual(usList[i].type);
            }
        })

    }
    })


    describe('test get Supplier',()=>{
        let usList = [];
        let data  =  {
            ID:1,
            name:"Francesco",
            surname:"Bergoglio",
            username:"pope@user1.ezwh.com",
            type:"supplier",
            password:"testpassword"
        
    }
    
    usList.push(data);
    let data1  =  {
        ID:2,
        name:"John",
        surname:"Snow",
        username:"john.snow@supplier.ezwh.com",
        type:"supplier",
        password:"testpassword"
    }
    usList.push(data1);
    
    
        beforeAll(async () =>{
            await dao.resetTableUser(db);
            await dao.storeUser(db,data);
            await dao.storeUser(db,data1);
        })
    
        
    
        testUser(usList);
    
    
        function testUser(usList){
    
            test('test get Supplier', async()=>{
                let res = await dao.getSupllierUsers(db);
    
                expect(res.length).toStrictEqual(usList.length);
    
                for(let i=0;i<usList.length;i++){
                    compareUser(res[i],usList[i]);
                   
                }
            })
    
        }
        })

    describe('test get User by ID',()=>{
        let data  =  {
            ID:1,
            name:"Francesco",
            surname:"Bergoglio",
            username:"pope@user1.ezwh.com",
            type:"supplier",
            password:"testpassword"   
    }
        
        
        
        beforeAll(async () =>{
            await dao.resetTableUser(db);
            await dao.storeUser(db,data);
        })
    
        
    
        testUser(data);
    
    
        function testUser(usList){
    
            test('test get User by ID', async()=>{
                let res = await dao.getUserById(db,1);    
                compareUser(res,usList);
                expect(res.type).toStrictEqual(usList.type);

            })
    
        }
        })



        describe('check login',()=>{
            let data  =  {
                
                ID:1,
                name:"Francesco",
                surname:"Bergoglio",
                username:"pope@user1.ezwh.com",
                type:"supplier",
                password:"testpassword"   
        }
            
            
            
            beforeAll(async () =>{
                await dao.resetTableUser(db);
                await dao.storeUser(db,data);
            })
        
           
        
            testUser(data);
        
        
            function testUser(usList){
        
                test('check login', async()=>{
                    let res = await dao.checkLogin(db,usList.username,usList.password,usList.type);    
                    expect(res.NAME).toStrictEqual(usList.name);
                    expect(res.ID).toStrictEqual(usList.ID);
    
                })
        
            }
            })


        describe('test Update User by username',()=>{
            let data  =  {
                ID:1,
                name:"Francesco",
                surname:"Bergoglio",
                username:"pope@user1.ezwh.com",
                type:"qualityEmployee",
                password:"testpassword"
            }

            let update ={
                oldType : "qualityEmployee",
                newType : "clerk"
            }
            
            
            beforeAll(async () =>{
            await dao.resetTableUser(db);
            await dao.storeUser(db,data);
            await dao.updateUser(db,data.username,update);

            })
        
        
            testUser(data,update.newType);
        
        
            function testUser(us,newType){
        
                test('update User', async()=>{
                    let res = await dao.getUserById(db,1);    
                    compareUser(res,us);
                    expect(res.type).toStrictEqual(newType);
                })
        
            }
            })



            describe('Delete User',()=>{
                let data  =  {
                    ID:1,
                    name:"Francesco",
                    surname:"Bergoglio",
                    username:"pope@user1.ezwh.com",
                    type:"supplier",
                    password:"testpassword"
                
            }
                
                
                
                beforeAll(async () =>{
                    await dao.resetTableUser(db);
                    await dao.storeUser(db,data);
                })
            
                testTestDescriptor(data);
            
            
                function testTestDescriptor(tdList){
            
                    test('Delete test Descriptor', async()=>{
                        await dao.deleteUser(db,"pope@user1.ezwh.com","supplier");
                        let yo = await dao.getSupllierUsers(db);    
                        expect(yo).toStrictEqual([])
                    })
            
                }
                })

        function compareUser(us, usList){
            expect(us.id).toStrictEqual(usList.ID);
            expect(us.username).toStrictEqual(usList.username);
            expect(us.name).toStrictEqual(usList.name);
            expect(us.surname).toStrictEqual(usList.surname);
            };
