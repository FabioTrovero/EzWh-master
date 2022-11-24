'use strict';
const Controller = require('../controller/ItemController');
const SKUController = require('../controller/SKUController');
const DB = require('../database/EzWh_Database.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);
const skuc  = new SKUController();
const dao  = new Controller();
const db = new DB('EzWh.db');

db.startConnection();


describe('test Item API', () => {

    beforeEach(async () => {
        await skuc.resetTable(db);
        await dao.resetTable(db)
    })

    newItem('adding a new item1', 201, 1, "description", 20, 1, 4);
    newItem('adding a new item2', 422);
    newItem('adding a new item3', 422, -10, "description", 20, 2, 4);
    newItem('adding a new item4', 422, "id", "description", 20, 2, 4);
    newItem('adding a new item5', 422, 1, 2, 20, 2, 4);
    newItem('adding a new item6', 422, 1, "description", -20, 2, 4);
    newItem('adding a new item7', 422, 1, "description", "price", 2, 4);
    newItem('adding a new item8', 422, 1, "description", 20, -10, 4);
    newItem('adding a new item9', 422, 1, "description", 20, "SKUid", 4);
    newItem('adding a new item10', 422, 1, "description", 20, 2, -8);
    newItem('adding a new item11', 422, 1, "description", 20, 2, "supplier");
    newItem('adding a new item12', 404, 1, "description", 20, 100, 4);
 
    getItems('getting all Item', 200);

    getItem('getting single Item1', 200, 1, 4);
    getItem('getting single Item2', 404, 100, 4);
    getItem('getting single Item3', 422, "id", 1);
    getItem('getting single Item4', 422, -1, 1);
    getItem('getting single Item5', 404, 1, 100);
    getItem('getting single Item6', 422, 1, "supplierId");
    getItem('getting single Item7', 422, 1, -1);

    modifyItem('modifing Item data1', 200, 1, 4, "description", 20);
    modifyItem('modifing Item data2', 404, 100, 1, "description", 20);
    modifyItem('modifing Item data3', 422, 1, 1, "description", -20);
    modifyItem('modifing Item data4', 422, -10, 1, "description", 20);
    modifyItem('modifing Item data5', 422, "id", 1, "description", 20);
    modifyItem('modifing Item data6', 422, 1, 1, 2, 20);
    modifyItem('modifing Item data7', 422, 1, 1, "description", "newPrice");
    modifyItem('modifing Item data8', 404, 1, 100, "description", 20);
    modifyItem('modifing Item data9', 422, 1, -10, "description", 20);
    modifyItem('modifing Item data10', 422, 1, "supplierId", 1, "description", 20);

    deleteItem('deleting Item1', 204, 1,4);
    deleteItem('deleting Item2', 422, "id", 1);
    deleteItem('deleting Item3', 422, 0, 1);
    deleteItem('deleting Item4', 422, 100, 1);
    deleteItem('deleting Item5', 422, 1, "supplierId");
    deleteItem('deleting Item6', 422, 1, 0);
    deleteItem('deleting Item7', 422, 1, 100);
 
});


function newItem(testName, expectedHTTPStatus, id, description, price, SKUId, supplierId) {
    it(testName, function (done) {
        let item = { id: id, description: description, price: price, SKUId: SKUId, supplierId: supplierId };
        if (id === undefined && description === undefined && price === undefined && SKUId === undefined && supplierId === undefined) {
            agent.post('/api/item')              //we are not sending any data
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            let sku = { description: "description", weight: 2, volume: 2, notes: "notes", price: 2, availableQuantity: 4 };
            agent.post('/api/sku')
                .send(sku)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.post('/api/item')
                        .send(item)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done();
                        });
                });
        }
    });
}


function getItems(testName, expectedHTTPStatus) {
    it(testName, function (done) {

        const item1 = { id: 1, description: "description1", price: 9.99, SKUId: 1, supplierId: 3 };
        const item2 = { id: 2, description: "description2", price: 10, SKUId: 1, supplierId: 4 };
        const item3 = { id: 3, description: "description3", price: 4, SKUId: 1, supplierId: 1 };

        let expectedResult = [{ "id": 1, "description": "description1", "price": 9.99, "SKUId": 1, "supplierId": 3 },
        { "id": 2, "description": "description2", "price": 10, "SKUId": 1, "supplierId": 4 },
        { "id": 3, "description": "description3", "price": 4, "SKUId": 1, "supplierId": 1 }];

        let sku = { description: "description", weight: 2, volume: 2, notes: "notes", price: 2, availableQuantity: 4 };
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/item')
                    .send(item1)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.post('/api/item')
                            .send(item2)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.post('/api/item')
                                    .send(item3)
                                    .then(function (res) {
                                        res.should.have.status(201);
                                        agent.get('/api/items')
                                            .then(function (r) {
                                                r.should.have.status(expectedHTTPStatus);
                                                r.body.should.deep.equal(expectedResult);
                                                done();
                                            });
                                    });
                            });
                    });
            });
    });
}


function getItem(testName, expectedHTTPStatus, id, supplierId) {
    it(testName, function (done) {
        const item = { id: 1, description: "description1", price: 9.99, SKUId: 1, supplierId: 4 };
        let sku = { description: "description", weight: 2, volume: 2, notes: "notes", price: 2, availableQuantity: 4 };
        const expectedResult = { "id": 1, "description": "description1", "price": 9.99, "SKUId": 1, "supplierId": 4 };

        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/item')
                    .send(item)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.get('/api/items/'+id+'/'+supplierId)
                            .then(function (res) {
                                console.log(res.status)
                                res.should.have.status(expectedHTTPStatus);
                                if (expectedHTTPStatus == 200){
                                    console.log(res.status)
                                    res.body.should.deep.equal(expectedResult);
                                    //res.body.SKUId.should.equal(1)
                                    
                                }
                                
                                done();
                                
                            });
                    });
            });

    });
}


function modifyItem(testName, expectedHTTPStatus, id, supplierId, newDescription, newPrice) {
    it(testName, function (done) {
        const item = { id: 1, description: "description", price: 45, SKUId: 1, supplierId: 4 };
        let data = { "newDescription": newDescription, "newPrice": newPrice };
        let sku = { description: "description", weight: 2, volume: 2, notes: "notes", price: 2, availableQuantity: 4 };

        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/item')
                    .send(item)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.put('/api/item/' + id + '/' + supplierId)
                            .send(data)
                            .then(function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                done();
                            });
                    });
            });

    });
}


function deleteItem(testName, expectedHTTPStatus, id, supplierId) {
    it(testName, function (done) {
        const item = { id: 1, description: "description", price: 45, SKUId: 1, supplierId: 4 };
        let sku = { description: "description", weight: 2, volume: 2, notes: "notes", price: 2, availableQuantity: 4 };

        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/item')
                    .send(item)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.delete('/api/items/' + id + '/' + supplierId)
                            .then(function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                done();
                            });
                    });
            });
    });
}
