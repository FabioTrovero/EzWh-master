'use strict'
const Controller = require('../controller/positionController');
const DB = require('../database/EzWh_Database.js');

//const { expect } = require('chai');


const dao  = new Controller();
const db = new DB('EzWh.db');

db.startConnection();

describe('Persistence Tests', () => {


    let data = (       
        {
            
                positionID:"800234543412",
                aisleID: "8002",
                row: "3454",
                col: "3412",
                maxWeight: 1000,
                maxVolume: 1000
            
    
        }
    )
    let data1 = (       
        {
            
                positionID:"800334543413",
                aisleID: "8003",
                row: "3454",
                col: "3413",
                maxWeight: 1000,
                maxVolume: 1000
            
    
        }
    )
    

        beforeEach(async () => {
        await db.startConnection();
        await dao.resetTable(db);
        

    });
    
    //test 
    

            test('Get all SKU', async () => {
                await dao.createPosition(db,data);
                await dao.createPosition(db,data1);

                
                
                let res = await dao.getPositions(db)
                console.log(res);

                

                expect(res).toEqual([
                    {
                        ID :"800234543412",
                        ISLE : "8002",
                        ROW : "3454",
                        COL : "3412",
                        MAXWEIGHT: 1000,
                        MAXVOLUME : 1000,
                        OCCUPIEDWEIGHT : 0,
                        OCCUPIEDVOLUME: 0,

                    },
                    {
                        ID :"800334543413",
                        ISLE : "8003",
                        ROW : "3454",
                        COL : "3413",
                        MAXWEIGHT: 1000,
                        MAXVOLUME : 1000,
                        OCCUPIEDWEIGHT : 0,
                        OCCUPIEDVOLUME: 0,

                    }
                    
                    
                ]);
                await dao.deletePosition(db,'800234543412');
                res = await dao.getPositions(db)
                 expect(res).toEqual([
                    {
                        ID :"800334543413",
                        ISLE : "8003",
                        ROW : "3454",
                        COL : "3413",
                        MAXWEIGHT: 1000,
                        MAXVOLUME : 1000,
                        OCCUPIEDWEIGHT : 0,
                        OCCUPIEDVOLUME: 0,

                    }
                ]
                );  
                });

                test('Modify position ', async () => {
                    await dao.createPosition(db,data);
                    let newPositionID = data1.aisleID+ data1.row + data1.col;
                    let mod = {
                        positionID : newPositionID,
                        aisleID: data1.aisleID,
                        row: data1.row,
                        col: data1.col,
                        maxWeight: 1200,
                        maxVolume: 600,
                        occupiedWeight: 200,
                        occupiedVolume:100
                    }
            

                    await dao.modifyPosition(db,mod,"800234543412")
                    
                    
                    let res = await dao.getPositions(db)
                    console.log(res);
    
                    
    
                    expect(res).toEqual([
                        {
                            ID :"800334543413",
                            ISLE : "8003",
                            ROW : "3454",
                            COL : "3413",
                            MAXWEIGHT: 1200,
                            MAXVOLUME : 600,
                            OCCUPIEDWEIGHT : 200,
                            OCCUPIEDVOLUME: 100,
    
                        }
                        
                        
                    ]);
                    });
                    
                      test('Modify positionID, no ID', async () => {
                          await dao.createPosition(db,data);
                          
                          let mod = {
                              aisleID: "8002",
                              row: "3454",
                              col: "3412",
                              maxWeight: 1200,
                              maxVolume: 600,
                              occupiedWeight: 200,
                              occupiedVolume:100
                          }
                  
      
                          
          
                          async function invalid(){
                              return await dao.modifyPositionIDOfPosition(db,mod,"1")
                           }
          
                          expect(invalid).rejects.toEqual({err:404});
                          });
  
                          test('Modify position ID ', async () => {
                              await dao.createPosition(db,data);
                              
                              let mod = {
                                  positionID : "800234543414"
                              }
                              let newPositionID = mod.positionID
                              let newAisleID = newPositionID.slice(0, 4);
                              let newRow = newPositionID.slice(4, 8);
                              let newCol = newPositionID.slice(8);
                              const d = {
                              positionID: newPositionID,
                              aisleID: newAisleID,
                              row: newRow,
                              col: newCol
                              }
                      
          
                              await dao.modifyPositionIDOfPosition(db,d,"800234543412")
                              
                              
                              let res = await dao.getPositions(db)
                              console.log(res);
              
                              
              
                              expect(res).toEqual([
                                  {
                                      ID :"800234543414",
                                      ISLE : "8002",
                                      ROW : "3454",
                                      COL : "3414",
                                      MAXWEIGHT: 1000,
                                      MAXVOLUME : 1000,
                                      OCCUPIEDWEIGHT : 0,
                                      OCCUPIEDVOLUME: 0,
              
                                  }
                                  
                                  
                              ]);
                              });
                              
  
                              test('Modify position, no ID', async () => {
                                  await dao.createPosition(db,data);
                                  
                                  let mod = {
                                      aisleID: "8002",
                                      row: "3454",
                                      col: "3412",
                                      maxWeight: 1200,
                                      maxVolume: 600,
                                      occupiedWeight: 200,
                                      occupiedVolume:100
                                  }
                          
              
                                  
                  
                                  async function invalid(){
                                      return await dao.modifyPosition(db,mod,"1")
                                   }
                  
                                  expect(invalid).rejects.toEqual({err:404});
                                  });
                                  test('End Connection Error', async () => {
                                      db.endConnection();
                                      await expect(dao.getPositions(db)).rejects.toEqual({err:500});
                                  });
  
      
        });