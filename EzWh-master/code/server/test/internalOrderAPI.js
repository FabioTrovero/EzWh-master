'use strict'
const Controller = require('../controller/internalOrderController');
const intO = require('../classes/internalOrder');
const DB = require('../database/EzWh_Database.js');
const SKUController = require('../controller/SKUController');
const SKU = new SKUController();
const skuserv = require('../services/SKUService')
const skuController = require('../controller/SKUController');
const dao1 = new skuController();
const sku = new skuserv(dao1);

const dao = new Controller();
const db = new DB('EzWh.db');

db.startConnection();
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);
let sku1 = (
    {
        description: "a product",
        weight: 100,
        volume: 50,
        notes: "first SKU",
        price: 10.99,
        availableQuantity: 50
    }
)


let sku2 = ({
    description: "another product",
    weight: 100,
    volume: 50,
    notes: "second SKU",
    price: 10.99,
    availableQuantity: 50
})
let sku3 = (
    {
        description: "a product",
        weight: 100,
        volume: 50,
        notes: "first SKU",
        price: 10.99,
        availableQuantity: 50
    }
)


let sku4 = ({
    description: "another product",
    weight: 100,
    volume: 50,
    notes: "second SKU",
    price: 10.99,
    availableQuantity: 50
})
let sku5 = ({
    description: "another product",
    weight: 100,
    volume: 50,
    notes: "second SKU",
    price: 10.99,
    availableQuantity: 50
})
let data = ({
    issueDate: "2021/11/29 09:33",
    products: [{ SKUId: 1, description: "a product", price: 10.99, qty: 30 },
    { SKUId: 2, description: "another product", price: 11.99, qty: 20 }],
    customerId: 1
})

let data1 = ({
    issueDate: "2021/11/29 09:33",
    products: [{ SKUId: 4, description: "a product", price: 10.99, qty: 30 },
    { SKUId: 5, description: "another product", price: 11.99, qty: 20 }],
    customerId: 1
})
let mod = {
    newState: "ACCEPTED"
}
describe('Test return Orders APIs', () => {

    beforeEach(async () => {

        db.startConnection();
        db.startConnection();
        await dao1.resetTable(db);
        await sku.create(db, sku1);
        await sku.create(db, sku2);
        await sku.create(db, sku3);
        await sku.create(db, sku4);
        await sku.create(db, sku5);
        await dao.resetTable(db);
        await dao.storeInternalOrder(data, db);
        await dao.storeInternalOrder(data1, db);
        await dao.modifyState(mod, db, 2);



    });


    newInternalOrder(201, "2021/11/29 09:33", [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
    { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }], 1)
    newInternalOrder(422, "/11/29 09:33", [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
    { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }], 1)
    newInternalOrder(422)
    newInternalOrder(422, "2021/11/29 09:33", [{ "SKUId": 1, "description": "a product", "price": -10.99, "qty": 3 },
    { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }], 1)
    newInternalOrder(422, "2021/11/29 09:33", [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 3 },
    { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 3 }], -1)
    newInternalOrder(422, "2021/11/29 09:33", [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": -3 },
    { "SKUId": 2, "description": "another product", "price": 11.99, "qty":-3 }], 1)

     getAllInternalOrders(200)
     getAllInternalOrdersIssued(200)
     getAllInternalOrdersAccepted(200)

    getInternalOrderbyId(200, 1);
    getInternalOrderbyId(200, 2);
    getInternalOrderbyId(422, 'aaa');
    getInternalOrderbyId(404, 100);

     modifyStateIo(200, 1, "ACCEPTED");
     modifyStateIo(422, 1, "DDD");
     modifyStateIo(404, 100, "ACCEPTED");
     modifyStateIo(200, 1, "COMPLETED", [{ "SkuID": 1, "RFID": "12345678901234567890123456789016" }, { "SkuID": 1, "RFID": "12345678901234567890123456789038" }]);
     modifyStateIo(422, 1, "COMPLETED");
     modifyStateIo(422, -1, "ACCEPTED");
 
    deleteInternalOrder(204,1);
    deleteInternalOrder(422,'aaa');
    deleteInternalOrder(422,-1);
    deleteInternalOrder(422,100);



    
});



function getAllInternalOrders(expectedHTTPStatus) {
    it(`Getting return Orders with params]`, function (done) {
        agent.get(`/api/internalOrders`)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.forEach(r => {
                    expect(r.id).not.to.be.undefined;
                    expect(r.issueDate).not.to.be.undefined;
                    expect(r.state).not.be.undefined;
                    if (r.state == "COMPLETED") {
                        r.products.forEach(p => {
                            expect(p.SKUId).not.to.be.undefined;
                            expect(p.description).not.to.be.undefined;
                            expect(p.price).not.to.be.undefined;
                            expect(p.RFID).not.to.be.undefined;
                        });

                    }
                    else {

                        r.products.forEach(p => {
                            expect(p.SKUId).not.to.be.undefined;
                            expect(p.description).not.to.be.undefined;
                            expect(p.price).not.to.be.undefined;
                            expect(p.qty).not.to.be.undefined;
                        });
                    }
                    expect(r.customerId).not.to.be.undefined;
                })
                done();
            })
            .catch(err => done(err));
    });
}


function getAllInternalOrdersIssued(expectedHTTPStatus) {
    it(`Getting internal Orders ]`, function (done) {
        agent.get(`/api/internalOrdersIssued`)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.forEach(r => {
                    expect(r.id).not.to.be.undefined;
                    expect(r.issueDate).not.to.be.undefined;
                    expect(r.state).not.be.undefined;
                    if (r.state == "COMPLETED") {
                        r.products.forEach(p => {
                            expect(p.SKUId).not.to.be.undefined;
                            expect(p.description).not.to.be.undefined;
                            expect(p.price).not.to.be.undefined;
                            expect(p.RFID).not.to.be.undefined;
                        });

                    }
                    else {

                        r.products.forEach(p => {
                            expect(p.SKUId).not.to.be.undefined;
                            expect(p.description).not.to.be.undefined;
                            expect(p.price).not.to.be.undefined;
                            expect(p.qty).not.to.be.undefined;
                        });
                    }
                    expect(r.customerId).not.to.be.undefined;
                })
                done();
            })
            .catch(err => done(err));
    });
}

function getAllInternalOrdersAccepted(expectedHTTPStatus) {
    it(`Getting internal Orders with params]`, function (done) {
        agent.get(`/api/internalOrdersAccepted`)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.forEach(r => {
                    expect(r.id).not.to.be.undefined;
                    expect(r.issueDate).not.to.be.undefined;
                    expect(r.state).not.be.undefined;
                    if (r.state == "COMPLETED") {
                        r.products.forEach(p => {
                            expect(p.SKUId).not.to.be.undefined;
                            expect(p.description).not.to.be.undefined;
                            expect(p.price).not.to.be.undefined;
                            expect(p.RFID).not.to.be.undefined;
                        });

                    }
                    else {

                        r.products.forEach(p => {
                            expect(p.SKUId).not.to.be.undefined;
                            expect(p.description).not.to.be.undefined;
                            expect(p.price).not.to.be.undefined;
                            expect(p.qty).not.to.be.undefined;
                        });
                    }
                    expect(r.customerId).not.to.be.undefined;
                })
                done();
            })
            .catch(err => done(err));
    });
}



function getInternalOrderbyId(expectedHTTPStatus, id) {
    it(`Getting internal Order with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/internalOrders/${id}`;
        agent.get(api)
            .then(function (r) {
                r.should.have.status(expectedHTTPStatus);
                if (r.status == 404 || r.status == 422) {
                    done()
                }
                else {
                    expect(r.body.id).not.to.be.undefined;
                    expect(r.body.issueDate).not.to.be.undefined;
                    expect(r.body.state).not.be.undefined;
                    if (r.body.state == "COMPLETED") {
                        r.body.products.forEach(p => {
                            expect(p.SKUId).not.to.be.undefined;
                            expect(p.description).not.to.be.undefined;
                            expect(p.price).not.to.be.undefined;
                            expect(p.RFID).not.to.be.undefined;
                        });

                    }
                    else {

                        r.body.products.forEach(p => {
                            expect(p.SKUId).not.to.be.undefined;
                            expect(p.description).not.to.be.undefined;
                            expect(p.price).not.to.be.undefined;
                            expect(p.qty).not.to.be.undefined;
                        });
                    }
                    expect(r.body.customerId).not.to.be.undefined;
                    done();
                }
            })
            .catch(err => done(err));
    });
}

function newInternalOrder(expectedHTTPStatus, date, products, customerId) {
    it(`Adding a new internal order with params [${[...arguments]?.join(',')}]`, function (done) {
        let io = { issueDate: date, products: products, customerId: customerId };
        agent.post('/api/internalOrders')
            .send(io)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    });
}

function modifyStateIo(expectedHTTPStatus, id, newState, products) {
    let iomod;

    if (products === undefined) {
        iomod = { newState: newState }
    }
    else {
        iomod = { newState: newState, products: products };

    }
    it(`modify Internal Order`, function (done) {
        let api = `/api/internalOrders/${id}`;
        agent.put(api)
            .send(iomod)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            })
            .catch(err => done(err));
    });
}
function deleteInternalOrder(expectedHTTPStatus, id) {
    it(`Deleting Internal Order`, function (done) {
        let api = `/api/internalOrders/${id}`;
        agent.delete(api)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            })
            .catch(err => done(err));
    });
}
