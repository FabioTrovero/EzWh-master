'use strict'
class TestResult{

    constructor(ID,date,result,testDescriptorId,RFID){
        this.ID = ID;
        this.date=date;
        this.result = result;
        this.testDescriptorId = testDescriptorId;
        this.RFID=RFID;
    }/*
    getId(){
        return this.ID;
    }
    getResult(){
        return this.result;
    }
    getDate(){
        return this.date;
    }
    setDate(date){
        this.date=date;
    }
    setResult(boolean){
        this.result=boolean;
    }
    setTestDescriptorID(integer){
        this.testDescriptorId=integer;
    }*/
    
}

module.exports = TestResult;
