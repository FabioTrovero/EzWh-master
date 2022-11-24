'use strict'
const dao = require('../mockDB/mockUserController');
const User = require('../classes/user');
const UserService = require('../services/userService');

const serv = new UserService(dao);

describe('test get  User of type supplier',()=>{
    let uList = [];
    let data  =  {
        id:1, 
        name : "Franco",
        surname : "Parino",
        username : "john.snow@supplier.ezwh.com",
       
    }
    
    uList.push(data);
    let data1  =  {
        id:2, 
        name : "Francesco",
        surname : "Bergoglio",
        username : "pope@user1.ezwh.com",
        
    }
    uList.push(data1);

    beforeAll(async () =>{
        dao.getSupllierUsers.mockReset();
        dao.getSupllierUsers.mockReturnValueOnce(uList);

    })
   


        test('map  User of type supplier', async()=>{
            let res = await serv.getSuppliers(undefined);

            expect(res.length).toStrictEqual(uList.length);
            expect(res).toStrictEqual(
                [ {
                    id:1, 
                    name : "Franco",
                    surname : "Parino",
                    email : "john.snow@supplier.ezwh.com",
                },
                {
                    id:2, 
                    name : "Francesco",
                    surname : "Bergoglio",
                    email : "pope@user1.ezwh.com",
                }

                ]);
            
        })
    })





    describe('map  User without managers',()=>{
        let uList = [];
        let data  =  {
            id:1, 
            name : "Franco",
            surname : "Parino",
            username : "john.snow@supplier.ezwh.com",
            type:"clerk"
           
        }
        
        uList.push(data);
        let data1  =  {
            id:2, 
            name : "Francesco",
            surname : "Bergoglio",
            username : "pope@user1.ezwh.com",
            type: "supplier"
            
        }
        uList.push(data1);
    
        beforeAll(async () =>{
            dao.getStoredUsersNoManager.mockReset();
            dao.getStoredUsersNoManager.mockReturnValueOnce(uList);
    
        })
       
    
    
            test('test get  User without managers', async()=>{
                let res = await serv.getUsersNoManager(undefined);
    
                expect(res.length).toStrictEqual(uList.length);
                expect(res).toStrictEqual(
                    [ {
                        id:1, 
                        name : "Franco",
                        surname : "Parino",
                        email : "john.snow@supplier.ezwh.com",
                        type:"clerk"
                    },
                    {
                        id:2, 
                        name : "Francesco",
                        surname : "Bergoglio",
                        email : "pope@user1.ezwh.com",
                        type: "supplier"
                    }
    
                    ]);
                
            })
        })


        
        
             describe('map  User by ID ',()=>{

                let data  =  {
                    id:1, 
                    name : "Franco",
                    surname : "Parino",
                    username : "john.snow@supplier.ezwh.com",
                    type:"clerk"
                   
                }
                
               
            
                beforeAll(async () =>{
                    dao.getUserById.mockReset();
                    dao.getUserById.mockReturnValueOnce(data);
            
                })
               
            
            
                    test('test get  User by ID', async()=>{
                        let res = await serv.getUser(undefined);
            
                        expect(res).toStrictEqual(
                             {
                                id:1, 
                                name : "Franco",
                                surname : "Parino",
                                username : "john.snow@supplier.ezwh.com",
                                type:"clerk"
                            },
                           );
                        
                    })
                })


                describe('login mapping',()=>{

                    let data  =  {
                        ID:1, 
                        NAME : "Franco",
                        username : "john.snow@supplier.ezwh.com",
                        
                       
                    }
                    
                   
                
                    beforeAll(async () =>{
                        dao.checkLogin.mockReset();
                        dao.checkLogin.mockReturnValueOnce(data);
                
                    })
                   
                
                
                        test('login mapping', async()=>{
                            let res = await serv.login(undefined,"john.snow@supplier.ezwh.com",undefined,undefined);
                
                            expect(res).toStrictEqual(
                                 {
                                    id:1, 
                                    name : "Franco",
                                    username : "john.snow@supplier.ezwh.com",
                                },
                               );
                            
                        })
                    })
    

