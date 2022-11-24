'use strict'
class TestDescriptor{

    constructor(ID,name,description,SKUId){
        this.ID = ID;
        this.name=name;
        this.description = description;
        this.SKUId = SKUId;
    }
    /*
    getId(){
        return this.ID;
    }
    setName(String){
        this.name=String;
    }
    setDescription(String){
        this.description=String;
    }
    setSKUId(integer){
        this.SKUId=integer;
    }*/
}

module.exports = TestDescriptor;
