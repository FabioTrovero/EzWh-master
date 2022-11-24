'use strict'
const dao = require('../mockDB/mockintOrderController');
const intO = require('../classes/internalOrder');
const intOService = require('../services/internalOrderService');
//const { expect } = require('chai');

const serv = new intOService(dao)

describe('test DTO',() =>{
    let List= [];

    List.push(new intO(1,"2021/11/29 09:33",'ISSUED',[{SKUID:1,description:"a product",price:10.99,quantity:30,RFID :0},
    {SKUID:2,description:"another product",price:11.99,quantity:20,RFID: 0}],1))
    
    List.push(new intO(2,"2021/11/29 09:33",'COMPLETED',[{SKUID:3,description:"a product",price:10.99,quantity:0,RFID:'12345678901234567890123456789016'},
    {SKUID:4,description:"another product",price:11.99,quantity:0.,RFID: '12345678901234567890123456789038'}],1))

    
    beforeEach(()=>{
        dao.storeInternalOrder.mockReset();
        dao.getInternalOrder.mockReturnValueOnce(List);
    })

    test('get All ',async() => {
        
        let res= await serv.getAllIntO(undefined);

        expect(res.length).toStrictEqual(List.length);
        expect(res).toEqual( 
            [
                {
                    id:1,
                    issueDate:"2021/11/29 09:33",
                    state: "ISSUED",
                    products: [{SKUId:1,description:"a product",price:10.99,qty:30},
                                {SKUId:2,description:"another product",price:11.99,qty:20}],
                    customerId : 1

                },
                {
                    id:2,
                    issueDate:"2021/11/29 09:33",
                    state: "COMPLETED",
                    products: [{SKUId:3,description:"a product",price:10.99,RFID:'12345678901234567890123456789016'},
                                {SKUId:4,description:"another product",price:11.99,RFID:"12345678901234567890123456789038"}],
                    customerId : 1
                
                }
                
            ]
               
    );
    })
})

      describe('test DTO by ID',() =>{
    
        let ro = new intO(1,"2021/11/29 09:33",'COMPLETED',[{SKUID:3,description:"a product",price:10.99,quantity:0,RFID:'12345678901234567890123456789016'},
        {SKUID:4,description:"another product",price:11.99,quantity:0.,RFID: '12345678901234567890123456789038'}],1);
        
        beforeEach(()=>{
            dao.storeInternalOrder.mockReset();
            dao.getInternalOrderbyID.mockReturnValueOnce(ro);
        })
    
        test('get by ID',async() => {
            
            let res= await serv.getIntObyId(undefined);
    
            expect(res).toEqual( 
                
                {
                    id:1,
                    issueDate:"2021/11/29 09:33",
                    state: "COMPLETED",
                    products: [{SKUId:3,description:"a product",price:10.99,RFID:'12345678901234567890123456789016'},
                                {SKUId:4,description:"another product",price:11.99,RFID:"12345678901234567890123456789038"}],
                    customerId : 1
                
                }
                
                   
        );
        })
    

})

describe('test DTO ISSUED',() =>{
    let List= [];

    List.push(new intO(1,"2021/11/29 09:33",'ISSUED',[{SKUID:1,description:"a product",price:10.99,quantity:30,RFID :0},
    {SKUID:2,description:"another product",price:11.99,quantity:20,RFID: 0}],1))
    
    

    
    beforeEach(()=>{
        dao.storeInternalOrder.mockReset();
        dao.getInternalOrderState.mockReturnValueOnce(List);
    })

    test('get All Issued ',async() => {
        
        let res= await serv.getAllIntObyState(undefined,'ISSUED');

        expect(res.length).toStrictEqual(List.length);
        expect(res).toEqual( 
            [
                {
                    id:1,
                    issueDate:"2021/11/29 09:33",
                    state: "ISSUED",
                    products: [{SKUId:1,description:"a product",price:10.99,qty:30},
                                {SKUId:2,description:"another product",price:11.99,qty:20}],
                    customerId : 1

                }
                
            ]
               
    );
    })
}) 

describe('test DTO ACCEPTED',() =>{
    let List= [];

    List.push(new intO(1,"2021/11/29 09:33",'ACCEPTED',[{SKUID:1,description:"a product",price:10.99,quantity:30,RFID :0},
    {SKUID:2,description:"another product",price:11.99,quantity:20,RFID: 0}],1))
    
    

    
    beforeEach(()=>{
        dao.storeInternalOrder.mockReset();
        dao.getInternalOrderState.mockReturnValueOnce(List);
    })

    test('get All Issued ',async() => {
        
        let res= await serv.getAllIntObyState(undefined,'ACCEPTED');

        expect(res.length).toStrictEqual(List.length);
        expect(res).toEqual( 
            [
                {
                    id:1,
                    issueDate:"2021/11/29 09:33",
                    state: "ACCEPTED",
                    products: [{SKUId:1,description:"a product",price:10.99,qty:30},
                                {SKUId:2,description:"another product",price:11.99,qty:20}],
                    customerId : 1

                }
                
            ]
               
    );
    })
}) 
 

