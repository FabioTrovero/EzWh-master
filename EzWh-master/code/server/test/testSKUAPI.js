'use strict';
const Controller = require('../controller/SKUController');
const ControllerTn = require('../controller/testDescriptorController')
const posController = require('../controller/positionController')
const DB = require('../database/EzWh_Database.js');

const pos = new posController();
const dao  = new Controller();
const td = new ControllerTn()
const db = new DB('EzWh.db');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
db.startConnection();

const app = require('../server');
var agent = chai.request.agent(app);

describe('TEST SKU API', () => {

    beforeEach(async () => {
        await pos.resetTable(db);
        await td.resetTableTestDescriptor(db);
        await dao.resetTable(db);
    })

    newSKU(201, "description", 20, 30, "notes", 10.99, 50);
    newSKU(422);
    newSKU(422, 100, 20, 30, "notes", 10.99, 50);
    newSKU(422, "description", "weight", 30, "notes", 10.99, 50);
    newSKU(422, "description", -10, 30, "notes", 10.99, 50);
    newSKU(422, "description", 20, "volume", "notes", 10.99, 50);
    newSKU(422, "description", 20, -20, "notes", 10.99, 50);
    newSKU(422, "description", 20, 30, 100, 10.99, 50);
    newSKU(422, "description", 20, 30, "notes", "price", 50);
    newSKU(422, "description", 20, 30, "notes", -10.99, 50);
    newSKU(422, "description", 20, 30, "notes", 10.99, "quantity");
    newSKU(422, "description", 20, 30, "notes", 10.99, -50);
    newSKU(422, "description", 20, 30, "notes", 10.99, 10.9);

    getSKUs(200);
    
    getSKU(200, 1);
    getSKU(404, 100);
    getSKU(422, "id");
    getSKU(422, -1);

    modifySKU(200, 1, "description", 100, 100, "notes", 10.99, 20);
    modifySKU(404, 100, "description",100, 100, "notes", 10.99, 20);
    modifySKU(422, 1, 200, 100, 100, "notes", 10.99, 20);
    modifySKU(422, 1, "description", "weight", 100, "notes", 10.99, 20);
    modifySKU(422, 1, "description", -100, 100, "notes", 10.99, 20);
    modifySKU(422, 1, "description", 100, "volume", "notes", 10.99, 20);
    modifySKU(422, 1, "description", 100, -100, "notes", 10.99, 20);
    modifySKU(422, 1, "description", 100, 100, 1000, 10.99, 20);
    modifySKU(422, 1, "description", 100, 100, "notes", "price", 20);
    modifySKU(422, 1, "description", 100, 100, "notes", -10.99, 20);
    modifySKU(422, 1, "description", 100, 100, "notes", 10.99, "quantity");
    modifySKU(422, 1, "description", 100, 100, "notes", -10.99, -20);
    modifySKU(422, 1, "description", 100, 100, "notes", -10.99, 20.99);
 
    modifySKUposition(200, 1, "111122223333", 100, 100, 10, "111122223333", 1000, 1000);
    modifySKUposition(404, 10, "111122223333", 100, 100, 10, "111122223333", 1000, 1000);
    modifySKUposition(422, 1, "999988887777", 100, 100, 10, "111122223333", 1000, 1000);
    modifySKUposition(422, "id", "111122223333", 100, 100, 10, "111122223333", 1000, 1000);
    modifySKUposition(422, 1, "positionID", 100, 100, 10, "111122223333", 1000, 1000);
    modifySKUposition(422, 1, "111122223333", 1000, 100, 10, "111122223333", 1000, 1000);
    modifySKUposition(422, 1, "111122223333", 100, 1000, 10, "111122223333", 1000, 1000);

    deleteSKU(204, 1);
    deleteSKU(422, "id");
    deleteSKU(204, 100);

});


function newSKU(expectedHTTPStatus, description, weight, volume, notes, price, availableQuantity) {
    it('adding a new SKU', function (done) {
        let sku = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity };
        if (description === undefined && weight === undefined && volume === undefined && notes === undefined 
                && price === undefined && availableQuantity === undefined) {
            agent.post('/api/sku')              //we are not sending any data
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        } else {
            agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        }
    });
}


function getSKUs(expectedHTTPStatus) {
    it('getting all SKU', function (done) {

        const sku1 = {description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };
        const sku2 = {description: "description 2", weight: 30, volume: 40, notes: "notes 2", price: 100.99, availableQuantity: 10 };
        const sku3 = {description: "description 3", weight: 50, volume: 30, notes: "notes 3", price: 20.00, availableQuantity: 25 };
        
        let expectedResult = [{ "id":1, "description" : "description 1", "weight" : 20, "volume" : 20, "notes" : "notes 1", "position" : "", "availableQuantity" : 50, "price" : 10.99, "testDescriptors" : [] },
            { "id":2, "description" : "description 2", "weight" : 30, "volume" : 40, "notes" : "notes 2", "position" : "", "availableQuantity" : 10, "price" : 100.99, "testDescriptors" : [] },
            { "id":3, "description" : "description 3", "weight" : 50, "volume" : 30, "notes" : "notes 3", "position" : "", "availableQuantity" : 25, "price" : 20.00, "testDescriptors" : [] }];
    
        agent.post('/api/sku')
            .send(sku1)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/sku')
                .send(sku2)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.post('/api/sku')
                    .send(sku3)
                    .then(function(res){
                        res.should.have.status(201);
                        agent.get('/api/skus')
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


function getSKU(expectedHTTPStatus, id) {
    it('getting single SKU', function (done) {
        const sku = {description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };
        const expectedResult = { "description" : "description 1", "weight" : 20, "volume" : 20, "notes" : "notes 1", "position" : "", "availableQuantity" : 50, "price" : 10.99, "testDescriptors" : [] }
        agent.post('/api/sku')
        .send(sku)
        .then(function (res) {
            res.should.have.status(201);
            agent.get('/api/skus/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                if(expectedHTTPStatus == 200)
                    res.body.should.be.deep.equal(expectedResult);
                done();
            });
        });
    });
}


function modifySKU(expectedHTTPStatus, id, description, weight, volume, notes, price, availableQuantity) {
    it('modifing SKU data', function (done) {
        const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };
        let data = { "newDescription" : description, "newWeight" : weight, "newVolume" : volume, "newNotes" : notes,
            "newPrice": price,"newAvailableQuantity" : availableQuantity };
        agent.post('/api/sku')
        .send(sku)
        .then(function (res) {
            res.should.have.status(201);
            agent.put('/api/sku/' + id)
            .send(data)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus); 
                done();
            });
        });
    });
}


function modifySKUposition(expectedHTTPStatus, id, position, skuWeight, skuVolume, skuQty, originalPosition, posWeight, posVolume) {
    it('modifing SKU position', function (done) {
        const aisle = originalPosition.slice(0, 4);     
        const row = originalPosition.slice(4, 8);       
        const col = originalPosition.slice(8); 
        const sku = { description: "description 1", weight: skuWeight, volume: skuVolume, notes: "notes 1", price: 10.99, availableQuantity: skuQty };
        const pos = {"positionID": originalPosition,"aisleID": aisle,"row": row,"col": col,"maxWeight": posWeight,"maxVolume": posVolume };
        let data = { "position": position };
        agent.post('/api/sku')
        .send(sku)
        .then(function (res) {
            res.should.have.status(201);
            agent.post('/api/position')
            .send(pos)
            .then(function (res) {
                res.should.have.status(201);
                agent.put(`/api/sku/${id}/position`)
                .send(data)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus); 
                    done();
                });
            });
        });
    });
}

function deleteSKU(expectedHTTPStatus, id) {
    it('deleting SKU', function (done) {
        const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };
        agent.post('/api/sku')
        .send(sku)
        .then(function (res) {
            res.should.have.status(201);
            agent.delete('/api/skus/' + id)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
        });
    });
}
