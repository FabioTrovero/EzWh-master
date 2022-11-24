'use strict'
const Controller = require('../controller/positionController');
const DB = require('../database/EzWh_Database.js');

//const { expect } = require('chai');


const dao  = new Controller();
const db = new DB('EzWh.db');

db.startConnection();
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

describe('TEST POSITION API', () => {

    beforeEach(async () => {
        await dao.resetTable(db);
    })

    newPosition(201, "111122223333", "1111", "2222", "3333", 1000, 1500);
    newPosition(422, "111111222222333333", "111111", "222222", "333333", 1000, 1500);
    newPosition(422, "111122223333", "2222", "1111", "3333", 1000, 1500);
    newPosition(422, "111122223333", "1111", "2222", "4444", 1000, 1500);
    newPosition(422, "aaaabbbbcccc", "1111", "2222", "3333", 1000, 1500);
    newPosition(422, "111122223333", "aaaa", "1111", "3333", 1000, 1500);
    newPosition(422, "111122223333", "2222", "1111", "3333", "weight", 1500);
    newPosition(422, "111122223333", "2222", "1111", "3333", -1000, 1500);
    newPosition(422, "111122223333", "2222", "1111", "3333", 1000, "volume");
    newPosition(422, "111122223333", "2222", "1111", "3333", 1000, -1500); 

     getPositions(200);

    modifyPosition(200, "111122223333", "9999", "8888", "7777", 2000, 2000, 100, 100, "111122223333","444455556666");
    modifyPosition(404, "123456789000", "9999", "8888", "7777", 2000, 2000, 100, 100, "111122223333","444455556666");
    modifyPosition(422, "aaaabbbbcccc", "9999", "8888", "7777", 2000, 2000, 100, 100, "111122223333","444455556666");
    modifyPosition(422, "111122223333", "4444", "5555", "6666", 2000, 2000, 100, 100, "111122223333","444455556666"); 
    modifyPosition(422, "111122223333", "444444", "555555", "666666", 2000, 2000, 100, 100, "111122223333","444455556666");
    modifyPosition(422, "111122223333", "aaaa", "8888", "7777", 2000, 2000, 100, 100, "111122223333","444455556666");
    modifyPosition(422, "111122223333", "9999", "8888", "7777", "maxWeight", 2000, 100, 100, "111122223333","444455556666");
    modifyPosition(422, "111122223333", "9999", "8888", "7777", -2000, 2000, 100, 100, "111122223333","444455556666");
    modifyPosition(422, "111122223333", "9999", "8888", "7777", 2000, "maxVolume", 100, 100, "111122223333","444455556666");
    modifyPosition(422, "111122223333", "9999", "8888", "7777", 2000, -2000, 100, 100, "111122223333","444455556666");
    modifyPosition(422, "111122223333", "9999", "8888", "7777", 2000, 2000, "occupiedWeight", 100, "111122223333","444455556666");
    modifyPosition(422, "111122223333", "9999", "8888", "7777", 2000, 2000, -100, 100, "111122223333","444455556666");
    modifyPosition(422, "111122223333", "9999", "8888", "7777", 2000, 2000, 100, "occupiedVolume", "111122223333","444455556666");
    modifyPosition(422, "111122223333", "9999", "8888", "7777", 2000, 2000, 100, -100, "111122223333","444455556666"); 
 
    modifyPositionID(200, "111122223333", "444455556666", "111122223333", "999988887777" );
    modifyPositionID(404, "000011112222", "444455556666", "111122223333", "999988887777" );
    modifyPositionID(422, "111122223333", "999988887777", "111122223333", "999988887777" );
    modifyPositionID(422, "aaaabbbbcccc", "444455556666", "111122223333", "999988887777" );
    modifyPositionID(422, "111122223333", "aaaabbbbcccc", "111122223333", "999988887777" );
    modifyPositionID(422, "111122223333", "444444555555666666", "111122223333", "999988887777" );
 
    deletePosition(204, "111122223333", "111122223333");
    deletePosition(422, "999988887777", "111122223333");
    deletePosition(422, "aaaabbbbcccc", "111122223333"); 

});


function newPosition(expectedHTTPStatus, positionID, aisle, row, col, maxWeight, maxVolume) {
    it('adding a new Position', function (done) {
        let pos = {"positionID": positionID,"aisleID": aisle,"row": row,"col": col,"maxWeight": maxWeight,"maxVolume": maxVolume };

        if (positionID === undefined && aisle === undefined && row === undefined && col === undefined 
                && maxWeight === undefined && maxVolume === undefined) {
            agent.post('/api/position')              //we are not sending any data
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        } else {
            agent.post('/api/position')
            .send(pos)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        }
    });
}


function getPositions(expectedHTTPStatus) {
    it('getting all Positions', function (done) {
        let pos1 = {"positionID": "111122223333","aisleID": "1111","row": "2222","col": "3333","maxWeight": 1000,"maxVolume": 1000 };
        let pos2 = {"positionID": "444455556666","aisleID": "4444","row": "5555","col": "6666","maxWeight": 2000,"maxVolume": 1500 };
        let pos3 = {"positionID": "777788889999","aisleID": "7777","row": "8888","col": "9999","maxWeight": 1500,"maxVolume": 1500 };
        
        let expectedResult = [
            {
                "positionID":"111122223333",
                "aisleID": "1111",
                "row": "2222",
                "col": "3333",
                "maxWeight": 1000,
                "maxVolume": 1000,
                "occupiedWeight": 0,
                "occupiedVolume": 0
            },
            {
                "positionID":"444455556666",
                "aisleID": "4444",
                "row": "5555",
                "col": "6666",
                "maxWeight": 2000,
                "maxVolume": 1500,
                "occupiedWeight": 0,
                "occupiedVolume": 0
            },
            {
                "positionID":"777788889999",
                "aisleID": "7777",
                "row": "8888",
                "col": "9999",
                "maxWeight": 1500,
                "maxVolume": 1500,
                "occupiedWeight": 0,
                "occupiedVolume": 0
            }
        ];
    
        agent.post('/api/position')
        .send(pos1)
        .then(function (res) {
            res.should.have.status(201);
            agent.post('/api/position')
            .send(pos2)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/position')
                .send(pos3)
                .then(function(res){
                    res.should.have.status(201);
                    agent.get('/api/positions')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.should.be.an('array');
                        r.body.should.be.deep.equal(expectedResult);
                        done();
                    });
                });
            });
        });
    });
}


function modifyPosition(expectedHTTPStatus, positionID, aisle, row, col, maxWeight, maxVolume, occupiedWeight, occupiedVolume, toModifyPositionID, existentPositionID) {
    it('modifing Position data', function (done) {
        let pos1 = {"positionID": toModifyPositionID,"aisleID": toModifyPositionID.slice(0, 4),"row": toModifyPositionID.slice(4, 8),"col": toModifyPositionID.slice(8),"maxWeight": 1000,"maxVolume": 1000 };
        let pos2 = {"positionID": existentPositionID,"aisleID": existentPositionID.slice(0, 4),"row": existentPositionID.slice(4, 8),"col": existentPositionID.slice(8),"maxWeight": 1000,"maxVolume": 1000 };
        let data = {
            "newAisleID": aisle,
            "newRow": row,
            "newCol": col,
            "newMaxWeight": maxWeight,
            "newMaxVolume": maxVolume,
            "newOccupiedWeight": occupiedWeight,
            "newOccupiedVolume":occupiedVolume };
        agent.post('/api/position')
        .send(pos1)
        .then(function(res){
            res.should.have.status(201);
            agent.post('/api/position')
            .send(pos2)
            .then(function(res){
                res.should.have.status(201);
                agent.put('/api/position/' + positionID)
                .send(data)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
            });   
        });
    });
}


function modifyPositionID(expectedHTTPStatus, positionID, newPositionID, toModifyPositionID, existentPositionID) {
    it('modifing positionID of Position', function (done) {
        let pos1 = {"positionID": toModifyPositionID,"aisleID": toModifyPositionID.slice(0, 4),"row": toModifyPositionID.slice(4, 8),"col": toModifyPositionID.slice(8),"maxWeight": 1000,"maxVolume": 1000 };
        let pos2 = {"positionID": existentPositionID,"aisleID": existentPositionID.slice(0, 4),"row": existentPositionID.slice(4, 8),"col": existentPositionID.slice(8),"maxWeight": 1000,"maxVolume": 1000 };
        let data = { "newPositionID": newPositionID };
        agent.post('/api/position')
        .send(pos1)
        .then(function(res){
            res.should.have.status(201);
            agent.post('/api/position')
            .send(pos2)
            .then(function(res){
                res.should.have.status(201);
                agent.put(`/api/position/${positionID}/changeID`)
                .send(data)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
            });   
        });
    });
}


function deletePosition(expectedHTTPStatus, positionID, existentPositionID) {
    it('deleting Position', function (done) {
        const pos = {"positionID": existentPositionID,"aisleID": existentPositionID.slice(0, 4),"row": existentPositionID.slice(4, 8),"col": existentPositionID.slice(8),"maxWeight": 1000,"maxVolume": 1000 };
        agent.post('/api/position')
        .send(pos)
        .then(function(res){
            res.should.have.status(201);
            agent.delete('/api/position/' + positionID)
            .then(function(res){
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        });
    });
}

