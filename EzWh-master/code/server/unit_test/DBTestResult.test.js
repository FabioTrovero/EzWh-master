'use strict'
const Controller = require('../controller/testResultController');
const DB = require('../database/EzWh_Database.js');
const testResult = require('../classes/testResult');

const dao  = new Controller();
const db = new DB('EzWh.db');

db.startConnection();


describe('test get All TestResults',()=>{
    let trList = [];
    let data  =  {
            ID:1,
            rfid : "123456789101112",
            idTestDescriptor : 14,
            Date : "2021/11/29" ,
            Result : false
        
    }
    
    trList.push(data);
    let data1  =  {
            ID:2,
            rfid : "123456789101113",
            idTestDescriptor : 7,
            Date : "2020/11/18" ,
            Result : true
    }
    trList.push(data1);

    beforeAll(async () =>{
        await dao.resetTableTestResult(db);
        await dao.storeTestResult(db,data);
        await dao.storeTestResult(db,data1);
    })

    console.log(trList);

    testTestResult(trList);


    function testTestResult(trList){

        test('test get All TestResults', async()=>{
            let res = await dao.getStoreTestResults(db);

            expect(res.length).toStrictEqual(trList.length);

            for(let i=0;i<trList.length;i++){
                compareTestResult(res[i],trList[i]);
            }
        })

    }
    })


    describe('test get TestResults by RFID',()=>{
        let trList = [];
        let data  =  {
                ID:1,
                rfid : "123456789101112",
                idTestDescriptor : 14,
                Date : "2021/11/29" ,
                Result : false
            
        }
        
        trList.push(data);
        let data1  =  {
                ID:2,
                rfid : "123456789101112",
                idTestDescriptor : 7,
                Date : "2020/11/18" ,
                Result : true
        }
        const rfid="123456789101112";
        trList.push(data1);
    
        beforeAll(async () =>{
            await dao.resetTableTestResult(db);
            await dao.storeTestResult(db,data);
            await dao.storeTestResult(db,data1);
        })
    
        console.log(trList);
    
        testTestResult(trList,rfid);
    
    
        function testTestResult(trList,rfid){
    
            test('test get TestResults by RFID', async()=>{
                let res = await dao.getTestResultByRFID(db,rfid);
    
                expect(res.length).toStrictEqual(trList.length);
    
                for(let i=0;i<trList.length;i++){
                    compareTestResult(res[i],trList[i]);
                }
            })
    
        }
        })

    describe('test get TestResult by ID',()=>{
        let data  =  {
            ID:1,
            rfid : "123456789101112",
            idTestDescriptor : 14,
            Date : "2021/11/29" ,
            Result : false
        
    }
        
        
        
        beforeAll(async () =>{
            await dao.resetTableTestResult(db);
            await dao.storeTestResult(db,data);
        })
    
    
        testTestResult(data);
    
    
        function testTestResult(trList){
    
            test('test get TestResult by ID', async()=>{
                let res = await dao.getTestResultById(db,1,trList.rfid); 
                      
                compareTestResult(res,trList);
            })
    
        }
        })


        describe('test Update TestResult by ID',()=>{
            let data  =  {
                ID:1,
                rfid : "123456789101112",
                idTestDescriptor : 14,
                Date : "2021/11/29" ,
                Result : false
            }

            let update ={
                
                    newIdTestDescriptor :12,
                    newDate :"2021/11/28",
                    newResult : true
            }

            let result ={
                    ID:1,
                    rfid : "123456789101112",
                    idTestDescriptor :12,
                    Date :"2021/11/28",
                    Result : true
            }
            
            beforeAll(async () =>{
            await dao.resetTableTestResult(db);
            await dao.storeTestResult(db,data);
            await dao.updateTestResult(db,1,data.rfid,update);

            })
        
        
            testTestResult(result);
        
        
            function testTestResult(tr){
        
                test('update TestResult', async()=>{
                    let res;
                    res = await dao.getTestResultById(db,1,tr.rfid);    
                    compareTestResult(res,tr);
                })
        
            }
            })

            describe('Delete testResult',()=>{
                let data  =  {
                    ID:1,
                    rfid : "123456789101112",
                    idTestDescriptor : 14,
                    Date : "2021/11/29" ,
                    Result : false
                
            }
                
                
                
                beforeAll(async () =>{
                    await dao.resetTableTestResult(db);
                    await dao.storeTestResult(db,data);
                })
            
                testTestDescriptor(data);
            
            
                function testTestDescriptor(data){
            
                    test('Delete testResult', async()=>{
                        await dao.deleteTestResult(db,data.ID,data.rfid);
                        try{
                              await dao.getTestResultById(db,data.ID,data.rfid);

                        }
                        catch(err){
                            expect(err.err).toStrictEqual(404)
                        }    
                        
                    })
            
                }
                })


        function compareTestResult(tr, trList){
            expect(tr.ID).toStrictEqual(trList.ID);
            expect(tr.date).toStrictEqual(trList.Date);
            expect(!!tr.result).toStrictEqual(trList.Result);
            expect(tr.testDescriptorId).toStrictEqual(trList.idTestDescriptor);
            expect(tr.RFID).toStrictEqual(trList.rfid);
            };