'use strict'
const dao = require('../mockDB/mockTestResultController');
const TestResult = require('../classes/testResult');
const testResultService = require('../services/testResultService');

const serv = new testResultService(dao);


describe('map list TestResults ',()=>{
    let trList = [];
    let data  =  {
        ID:1, 
        testDescriptorId : 11,
        date : "2021/11/29",
        result : false,
       
    }
    
    trList.push(data);
    let data1  =  {
        ID:2,
        testDescriptorId : 8,
        date : "2020/11/20",
        result : true,
        
    }
    trList.push(data1);

    beforeAll(async () =>{
        dao.getTestResultByRFID.mockReset();
        dao.getTestResultByRFID.mockReturnValueOnce(trList);

    })
   


        test('test get  TestResults ', async()=>{
            let res = await serv.getTestResultsRFID(undefined,undefined);

            expect(res.length).toStrictEqual(trList.length);
            expect(res).toStrictEqual(
                [ {
                    id:1,
                    idTestDescriptor : 11,
                    Date : "2021/11/29" ,
                    Result : false
                },
                {
                    id:2,
                    idTestDescriptor : 8,
                    Date : "2020/11/20" ,
                    Result : true
                }

                ]);
            
        })
    })


    describe('map TestResult ',()=>{
        let data  =  {
            ID:1, 
            testDescriptorId : 11,
            date : "2021/11/29",
            result : false,
        }
        
        
        
        beforeAll(async () =>{
            dao.getTestResultById.mockReset();
            dao.getTestResultById.mockReturnValueOnce(data);
        })
    
    
       
    
            test('test get TestResult by ID', async()=>{
                let res = await serv.getTestResultID(undefined,undefined,undefined);    
                expect(res).toStrictEqual(
                    {
                        id:1,
                        idTestDescriptor : 11,
                        Date : "2021/11/29" ,
                        Result : false
                    }
                )
            })
    })