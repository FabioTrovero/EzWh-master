'use strict'

class testResultService{
    constructor(dao){this.dao = dao};
    
    /*getAllTestResult = async(db) =>{
        try{
            let tr = await this.dao.getStoreTestResults(db);
           
            tr = tr.map((r) => (
                {   id : r.ID,
                    date : r.date,
                    result : !!r.result,
                    testDescriptorId: r.testDescriptorId
                }
            ));
            
            return tr;
        }
        catch(err){console.log(err);
            throw err;}
    }*/

    getTestResultsRFID = async(db,rfid) =>{
        try{
            
            let tr = await this.dao.getTestResultByRFID(db,rfid);
            
            tr = tr.map((r) => (
                {   id : r.ID, 
                    idTestDescriptor: r.testDescriptorId,
                    Date : r.date,
                    Result : !!r.result,
                   
                }
            ));
            
            return tr;
        }
        catch(err){console.log(err);
            throw err;}
    }

    
    getTestResultID = async(db,id,rfid) =>{
        try{
            let r = await this.dao.getTestResultById(db,id,rfid);
            let res = (
                {  
                    id : r.ID, 
                    idTestDescriptor: r.testDescriptorId,
                    Date : r.date,
                    Result : !!r.result,
                }
            );
            
            return res;
        }
        catch(err){console.log(err);
            throw err;}
    }


    store= async(db,data) =>{
        try{
            await this.dao.storeTestResult(db,data);
        }
        catch(err){throw err;}

    }

    update= async(db,id,rfid,data) =>{
        try{
            await this.dao.updateTestResult(db,id,rfid,data);
        }
        catch(err){throw err;}
    }

    delete= async(db,id,rfid) =>{
        try{
            await this.dao.deleteTestResult(db,id,rfid);
        }
        catch(err){throw err;}
    }

}
module.exports = testResultService;