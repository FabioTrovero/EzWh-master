'use strict'
const dao = require('../mockDB/mockTestDescriptorController');
const TestDescriptor = require('../classes/testDescriptor');
const testDescriptorService = require('../services/testDescriptorService');

const serv = new testDescriptorService(dao)


describe('test get All TestDescriptors',()=>{
    let tdList = [];
    let data  =  {
        ID:1,
        name : "test 1",
        description : "test of an item",
        SKUId : 1,
    }
    
    tdList.push(data);
    let data1  =  {
        ID:2,
        name : "test 2",
        description : "test of an item 2",
        SKUId : 3,
    }
    tdList.push(data1);

    beforeAll(async () =>{
        dao.getStoreTestDescriptors.mockReset();
        dao.getStoreTestDescriptors.mockReturnValueOnce(tdList);

    })
    


        test('map list TestDescriptors', async()=>{
            let res = await serv.getAllTestDescriptor(undefined);

            expect(res.length).toStrictEqual(tdList.length);
            expect(res).toStrictEqual(
                [ {
                    id:1,
                    name : "test 1",
                    procedureDescription : "test of an item",
                    idSKU : 1,
                },
                {
                    id:2,
                    name : "test 2",
                    procedureDescription : "test of an item 2",
                    idSKU : 3,
                }

                ]);
            
        })
    })


    describe('map TestDescriptor ',()=>{
        let data  =  {
            ID:2,
            name : "test 2",
            description : "test of an item 2",
            SKUId : 3,
        }
        
        
        
        beforeAll(async () =>{
            dao.getTestDescriptorByID.mockReset();
            dao.getTestDescriptorByID.mockReturnValueOnce(data);
        })
    
    
       
    
            test('test get TestDescriptor ', async()=>{
                let res = await serv.getTestDescriptor(undefined,1);    
                expect(res).toStrictEqual(
                     {
                        id:2,
                        name : "test 2",
                        procedureDescription : "test of an item 2",
                        idSKU : 3,
                    }
                )
            })
    })