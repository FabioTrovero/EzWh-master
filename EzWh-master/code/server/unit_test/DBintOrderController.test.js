'use strict'
const Controller = require('../controller/internalOrderController');
const intO = require('../classes/internalOrder');
const DB = require('../database/EzWh_Database.js');
const SKUController = require('../controller/SKUController');
const SKU = new SKUController();
const skuserv = require('../services/SKUService')
const skuController = require('../controller/SKUController');
const dao1 = new skuController();
const sku = new skuserv(dao1);
//const { expect } = require('chai');

const dao  = new Controller();
const db = new DB('EzWh.db');

db.startConnection();

function IO(SKUID,description,price,quantity,RFID) {
    this.SKUID = SKUID;
    this.description=description;
    this.price=price;
    this.quantity = quantity;
    this.RFID = RFID;
}

describe('Persistence Tests', () => {
    let sku1 = (       
        {
            description : "a product",
            weight : 100,
            volume : 50,
            notes : "first SKU",
            price : 10.99,
            availableQuantity : 50
        }
    )


    let sku2 =({
            description : "another product",
            weight : 100,
            volume : 50,
            notes : "second SKU",
            price : 10.99,
            availableQuantity : 50
        })
        let sku3 = (       
            {
                description : "a product",
                weight : 100,
                volume : 50,
                notes : "first SKU",
                price : 10.99,
                availableQuantity : 50
            }
        )
    
    
        let sku4 =({
                description : "another product",
                weight : 100,
                volume : 50,
                notes : "second SKU",
                price : 10.99,
                availableQuantity : 50
            })
            let sku5 =({
                description : "another product",
                weight : 100,
                volume : 50,
                notes : "second SKU",
                price : 10.99,
                availableQuantity : 50
            })
    let data = (        {
        issueDate:"2021/11/29 09:33",
        products: [{SKUId:1,description:"a product",price:10.99,qty:30},
                    {SKUId:2,description:"another product",price:11.99,qty:20}],
        customerId : 1
    })  

    let data1 =(        {
        issueDate:"2021/11/29 09:33",
        products: [{SKUId:4,description:"a product",price:10.99,qty:30},
                    {SKUId:5,description:"another product",price:11.99,qty:20}],
        customerId : 1
    })

        beforeEach(async () => {
        //sku drop table
        db.startConnection();
        await dao1.resetTable(db);
        await sku.create(db,sku1);
        await sku.create(db,sku2);
        await sku.create(db,sku3);
        await sku.create(db,sku4);
        await sku.create(db,sku5);
        await dao.resetTable(db);
        //add SKU Item 1 and 2,3,4
        

    });
    
    //test 
    

            test('Get all Restock Orders', async () => {
                await dao.storeInternalOrder(data,db);
                await dao.storeInternalOrder(data1,db);
                
                
                let product1=[];
                let product2= [];
                let sku=await SKU.getSKUById(db,1);
                product1.push(new IO(sku.ID,sku.DESCRIPTION,sku.PRICE,30,0));
                sku=await SKU.getSKUById(db,2);
                product1.push(new IO(sku.ID,sku.DESCRIPTION,sku.PRICE,20,0));
                sku = await SKU.getSKUById(db,4);
                product2.push(new IO(sku.ID,sku.DESCRIPTION,sku.PRICE,30,0));
                sku = await SKU.getSKUById(db,5);
                product2.push(new IO(sku.ID,sku.DESCRIPTION,sku.PRICE,20,0));
                let res = await dao.getInternalOrder(db);

                expect(res).toEqual([
                    new intO(1,data.issueDate,'ISSUED',product1,data.customerId),
                    new intO(2,data1.issueDate,'ISSUED',product2,data.customerId)
                ]);
                await dao.deleteInternalOrder(db,1);
                res = await dao.getInternalOrder(db)
                 expect(res).toEqual([
                    new intO(2,data.issueDate,'ISSUED',product2,data.customerId),
                ]
                ); 
                });

                test('Get all Restock Orders Issued', async () => {
                    await dao.storeInternalOrder(data,db);
                    await dao.storeInternalOrder(data1,db);

                    let mod = {
                        newState:"ACCEPTED"
                    }
            
                    
                    let product1=[];
                    let product2= [];
                    let sku=await SKU.getSKUById(db,1);
                    product1.push(new IO(sku.ID,sku.DESCRIPTION,sku.PRICE,30,0));
                    sku=await SKU.getSKUById(db,2);
                    product1.push(new IO(sku.ID,sku.DESCRIPTION,sku.PRICE,20,0));
                    sku = await SKU.getSKUById(db,4);
                    product2.push(new IO(sku.ID,sku.DESCRIPTION,sku.PRICE,30,0));
                    sku = await SKU.getSKUById(db,5);
                    product2.push(new IO(sku.ID,sku.DESCRIPTION,sku.PRICE,20,0));
                    await dao.modifyState(mod,db,2);
                    let res = await dao.getInternalOrderState(db,'ISSUED');
                    

                    expect(res).toEqual([
                        new intO(1,data.issueDate,'ISSUED',product1,data.customerId),
                    ]);
                    
                    });

                    test('Get all Restock Orders Accepted', async () => {
                        await dao.storeInternalOrder(data,db);
                        await dao.storeInternalOrder(data1,db);
    
                        let mod = {
                            newState:"ACCEPTED"
                        }
                
                        
                        let product1=[];
                        let product2= [];
                        let sku=await SKU.getSKUById(db,1);
                        product1.push(new IO(sku.ID,sku.DESCRIPTION,sku.PRICE,30,0));
                        sku=await SKU.getSKUById(db,2);
                        product1.push(new IO(sku.ID,sku.DESCRIPTION,sku.PRICE,20,0));
                        sku = await SKU.getSKUById(db,4);
                        product2.push(new IO(sku.ID,sku.DESCRIPTION,sku.PRICE,30,0));
                        sku = await SKU.getSKUById(db,5);
                        product2.push(new IO(sku.ID,sku.DESCRIPTION,sku.PRICE,20,0));
                        await dao.modifyState(mod,db,2);
                        let res = await dao.getInternalOrderState(db,'ACCEPTED');
                        
    
                        expect(res).toEqual([
                            new intO(2,data1.issueDate,'ACCEPTED',product2,data1.customerId),
                        ]);
                        
                        });
    

             test('Get Restock Orders by ID', async () => {
                await dao.storeInternalOrder(data,db);

                
                let product1= [];
                let sku=await SKU.getSKUById(db,1);
                product1.push(new IO(sku.ID,sku.DESCRIPTION,sku.PRICE,30,0));
                sku=await SKU.getSKUById(db,2);
                product1.push(new IO(sku.ID,sku.DESCRIPTION,sku.PRICE,20,0));
                
                let res = await dao.getInternalOrderbyID(db,1);
                



                expect(res).toEqual(                  
                    new intO(1,data.issueDate,'ISSUED',product1,data.customerId)
                );
        
            });
            test('Get Restock Orders by ID,No ID', async () => {
                
                
                async function invalid(){
                    return await dao.getInternalOrderbyID(db,1);
                 }

                expect(invalid).rejects.toEqual(404);
        
            });

            test('End Connection Error', async () => {
                db.endConnection();
                await expect(dao.getInternalOrder()).rejects.toThrow();
            });

            test('Modify Status', async () => {
                await dao.storeInternalOrder(data,db);
                        await dao.storeInternalOrder(data1,db);
    
                        let mod = {
                            newState:"ACCEPTED"
                        }
                
                        
                        let product1=[];
                        let sku=await SKU.getSKUById(db,1);
                        product1.push(new IO(sku.ID,sku.DESCRIPTION,sku.PRICE,30,0));
                        sku=await SKU.getSKUById(db,2);
                        product1.push(new IO(sku.ID,sku.DESCRIPTION,sku.PRICE,20,0));
                        sku = await SKU.getSKUById(db,4);
                        await dao.modifyState(mod,db,1);
                        let res = await dao.getInternalOrderbyID(db,1);
                        

                expect(res).toEqual(new intO(1,data.issueDate,'ACCEPTED',product1,data.customerId));
        
            });

            test('Modify Status,NO ID', async () => {

                
                async function invalid(){
                    return await dao.modifyState(data,db,3);
                 }

                expect(invalid).rejects.toEqual(404);
        
            });

            test('ADD state COMPLETED', async () => {
                await dao.storeInternalOrder(data,db);


                let mod ={
                    newState:"COMPLETED",
                    products:[{SkuID:1,RFID:"12345678901234567890123456789016"},
                    {SkuID:2,RFID:"12345678901234567890123456789038"}]
                }
        
        
                let product1=[];
                let sku=await SKU.getSKUById(db,1);
                product1.push(new IO(sku.ID,sku.DESCRIPTION,sku.PRICE,0,mod.products[0].RFID));
                sku=await SKU.getSKUById(db,2);
                product1.push(new IO(sku.ID,sku.DESCRIPTION,sku.PRICE,0,mod.products[1].RFID));
                await dao.modifyState(mod,db,1);
                let res = await dao.getInternalOrderbyID(db,1);
              


                expect(res).toEqual(
                    new intO(1,data.issueDate,'COMPLETED',product1,data.customerId)
                );
        
            });         
        });