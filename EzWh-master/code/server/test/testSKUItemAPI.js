'use strict'
const Controller = require('../controller/SKUItemController');
const skuserv = require('../services/SKUService')
const skuController = require('../controller/SKUController');
const DB = require('../database/EzWh_Database.js');

const dao1 = new skuController();
const dao = new Controller();
const db = new DB('EzWh.db');

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();
db.startConnection();

const app = require('../server');
var agent = chai.request.agent(app);

describe('TEST SKUITEM API', () => {

    beforeEach(async () => {
        await dao1.resetTable(db);
        await dao.resetTable(db);
    })

    newSKUITEM(201, "12345678901234567890123456789015", 1, "2021/11/29 12:30");
    newSKUITEM(422, "12345678901234567890123456789015", -1, "2021/11/29 12:30");
    newSKUITEM(422, "12345678901234567890123456789015", 1, "2/11/29 12:30");
    newSKUITEM(422, "12345678901234567890123456789015", 1, "2021/11/29 26:30");
    newSKUITEM(422, 1, 1, "2021/11/29 12:30");
    newSKUITEM(404, "12345678901234567890123456789015", 2, "2021/11/29 12:30");
    newSKUITEM(422);


    getSKUItems(200); 

    getSKUbyRFID(200, "12345678901234567890123456789019");
    getSKUbyRFID(404, "12345678901234567890123456789049");
    getSKUbyRFID(422, "abc");
    
    modifySKUItem(200,'12345678901234567890123456789019','12345678901234567890123456789015',1,"2021/11/29 12:30")
    modifySKUItem(422,'abc','12345678901234567890123456789015',1,"2021/11/29 12:30")
    modifySKUItem(422,'12345678901234567890123456789019','12345678901234567890123456789015',-1,"2021/11/29 12:30")
    modifySKUItem(404,'12345678901234567890123456789039','12345678901234567890123456789015',1,"2021/11/29 12:30")
    modifySKUItem(422,'12345678901234567890123456789039','12345678901234567890123456789015',1,"/11/29 12:30")
    modifySKUItem(422,'12345678901234567890123456789039','ABC',1,"2021/11/29 12:30")

    
    deleteSKUItem(422, "id");
    deleteSKUItem(204, 100); 
    deleteSKUItem(204, "12345678901234567890123456789019");
   
    SKUItembyskuid(200, 1);
    SKUItembyskuid(422, 'abc');
    SKUItembyskuid(404, 2);

});


function newSKUITEM(expectedHTTPStatus, RFID, SKUID, date) {
    it('adding a new SKU', function (done) {
        let skuItem = { RFID: RFID, SKUId: SKUID, DateOfStock: date };
        let sku = { description: "a product", weight: 100, volume: 50, notes: "first SKU", price: 10.99, availableQuantity: 50 };
        if (RFID === undefined && SKUID === undefined && date === undefined) {
            agent.post('/api/skuitem')
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                });
        } else {
            agent.post('/api/sku')
                .send(sku)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.post('/api/skuitem')
                        .send(skuItem)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done();
                        });
                });

        }
    });
}


function getSKUItems(expectedHTTPStatus) {
    it('getting all SKU', function (done) {

        let skuItem = { RFID: "12345678901234567890123456789019", SKUId: 1, DateOfStock: "2021/11/29 12:30" };
        let skuItem1 = { RFID: "12345678901234567890123456789014", SKUId: 1, DateOfStock: "2021/11/29 12:30" };
        let skuItem2 = { RFID: "12345678901234567890123456789016", SKUId: 1, DateOfStock: "2021/11/29 12:30" };
        let sku = { description: "a product", weight: 100, volume: 50, notes: "first SKU", price: 10.99, availableQuantity: 50 };

        let expectedResult = [{ "RFID": "12345678901234567890123456789019", "SKUId": 1, "Available": 0, "DateOfStock": "2021/11/29 12:30" },
        { "RFID": "12345678901234567890123456789014", "SKUId": 1, "Available": 0, "DateOfStock": "2021/11/29 12:30" },
        { "RFID": "12345678901234567890123456789016", "SKUId": 1, "Available": 0, "DateOfStock": "2021/11/29 12:30" }];
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/skuitem')
                    .send(skuItem)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.post('/api/skuitem')
                            .send(skuItem1)
                            .then(function (res) {
                                res.should.have.status(201);
                                agent.post('/api/skuitem')
                                    .send(skuItem2)
                                    .then(function (res) {
                                        res.should.have.status(201);
                                        agent.get('/api/skuitems')
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

    });
}



function getSKUbyRFID(expectedHTTPStatus, rfid) {
    it('get SKU by RFID', function (done) {
        let skuItem = { RFID: "12345678901234567890123456789019", SKUId: 1, DateOfStock: "2021/11/29 12:30" };
        let expectedResult = ({ "RFID": "12345678901234567890123456789019", "SKUId": 1, "Available": 0, "DateOfStock": "2021/11/29 12:30" })

        let sku = { description: "a product", weight: 100, volume: 50, notes: "first SKU", price: 10.99, availableQuantity: 50 };

        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/skuitem')
                    .send(skuItem)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.get('/api/skuitems' + rfid)
                            .then(function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                r.body.should.be.deep.equal(expectedResult);
                            });
                        done();
                    });
            });

    });

}

function modifySKUItem(expectedHTTPStatus, rfid, newRFID, qty, date) {
    it('modifing SKU data', function (done) {

        let skuItem = { RFID: "12345678901234567890123456789019", SKUId: 1, DateOfStock: "2021/11/29 12:30" };
        const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };
        let data = {
            newRFID: newRFID,
            newAvailable: qty,
            newDateOfStock: date
        }

        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/skuitem')
                    .send(skuItem)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.put('/api/skuitems/' + rfid)
                            .send(data)
                            .then(function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                done();
                            });
                    });
            });
    });
}

function SKUItembyskuid(expectedHTTPStatus, id) {
    it('get SKU Item by SKUId', function (done) {

        let skuItem = { RFID: "12345678901234567890123456789019", SKUId: 1, DateOfStock: "2021/11/29 12:30" };
        const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };
        let data = {
            newRFID: "12345678901234567890123456789019",
            newAvailable: 1,
            newDateOfStock: "2021/11/29 12:30"
        }
        let expectedResult = [
            {
                "RFID": "12345678901234567890123456789019",
                "SKUId": 1,
                "DateOfStock": "2021/11/29 12:30"
            }
        ]
        let rfid = "12345678901234567890123456789019"


        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/skuitem')
                    .send(skuItem)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.put('/api/skuitems/' + rfid)
                            .send(data)
                            .then(function (res) {
                                agent.get('/api/skuitems/sku/' + id)
                                    .send(data)
                                    .then(function (r) {
                                        r.should.have.status(expectedHTTPStatus);
                                        //r.body.should.be.deep.equal(expectedResult);
                                        done();
                                    });
                            });
                    });
            });

    });
}




function deleteSKUItem(expectedHTTPStatus, rfid) {
    it('deleting SKUItem', function (done) {
        let skuItem = { RFID: "12345678901234567890123456789019", SKUId: 1, DateOfStock: "2021/11/29 12:30" };
        const sku = { description: "description 1", weight: 20, volume: 20, notes: "notes 1", price: 10.99, availableQuantity: 50 };
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(201);
                agent.post('/api/skuitem')
                    .send(skuItem)
                    .then(function (res) {
                        res.should.have.status(201);
                        agent.delete('/api/skuitems/' + rfid)
                            .then(function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                done();
                            });
                    });
            });
    });
}
