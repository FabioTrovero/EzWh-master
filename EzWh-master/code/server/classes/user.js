'use strict'
class User{

    constructor(id,username,name,surname,password,type){
        this.id=id;
        this.username = username;
        this.name=name;
        this.surname = surname;
        this.password = password;
        this.type = type;
    }
    /*setPassword(String){
        this.password=String;    
    }
    setSurname(String){
        this.surname=String;
    }
    setName(String){
        this.name=String;
    }
    setUsername(String){
        this.username=String;
    }
    setType(String){
        this.type=String;
    }
    checkLogin(username,password){
        if(username==this.username&&password==this.password){
            return true;
        }
        else{
            return false;
        }
    }*/
}

module.exports = User;

