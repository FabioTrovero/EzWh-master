

'use strict'
const Controller = require('../controller/restockOrderController');
const RESO = require('../classes/restockOrder');
const DB = require('../database/EzWh_Database.js');
const SKUController = require('../controller/SKUController');
const ItemController = require('../controller/ItemController');
const TRcontroller = require('../controller/testResultController');
const SKU = new SKUController();
const TR = new TRcontroller();
const TRservice = require('../services/testResultService');
const TRserv = new TRservice(TR);
const skuserv = require('../services/SKUService')
const skuController = require('../controller/SKUController');
const dao1 = new skuController();
const sku = new skuserv(dao1);
//const { expect } = require('chai');
const dao2 = new ItemController();
const dao = new Controller();
const db = new DB('EzWh.db');

const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
const e = require('express');
var agent = chai.request.agent(app);

db.startConnection();


describe('Test restock Orders API', () => {
    let item1 = (
        {
            id: 1,
            description: "a new item",
            price: 10.99,
            SKUId: 1,
            supplierId: 1

        })
    let item2 = (
        {
            id: 2,
            description: "a new item",
            price: 10.99,
            SKUId: 2,
            supplierId: 1
        })
    let item3 = (
        {
            id: 3,
            description: "a new item",
            price: 10.99,
            SKUId: 3,
            supplierId: 1
        })
    let item4 = (
        {
            id: 4,
            description: "a new item",
            price: 10.99,
            SKUId: 4,
            supplierId: 1
        })
    let tr1 = {
        ID: 1,
        rfid: "12345678901234567890123456789016",
        idTestDescriptor: 14,
        Date: "2021/11/29",
        Result: true
    }
    let tr2 = {
        ID: 2,
        rfid: "12345678901234567890123456789017",
        idTestDescriptor: 14,
        Date: "2021/11/29",
        Result: false
    }
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

    beforeEach(async () => {
        db.startConnection();
        await TR.resetTableTestResult(db);
        await TRserv.store(db, tr1);
        await TRserv.store(db, tr2);

        await dao1.resetTable(db);
        await sku.create(db, sku1);
        await sku.create(db, sku2);
        await sku.create(db, sku3);
        await sku.create(db, sku4);
        await dao2.resetTable(db)
        await dao2.storeItem(item1, db);
        await dao2.storeItem(item2, db);
        await dao2.storeItem(item3, db);
        await dao2.storeItem(item4, db);
        await dao.resetTable(db);
    })

    newRestockOrder(201, "2021/11/29 09:33",
        [{ "SKUId": 1,"itemId":1, "description": "a product", "price": 10.99, "qty": 30 },
        { "SKUId": 2,"itemId":2, "description": "another product", "price": 11.99, "qty": 20 }], 1);

    newRestockOrder(422, "2021/11/29 09:33",
        [{ "description": "a product", "price": 10.99, "qty": 30 },
        { "SKUId": 2,"itemId":2, "description": "another product", "price": 11.99, "qty": 20 }], 1);

    newRestockOrder(422, "/11/29 09:33",
        [{ "SKUId": 1,"itemId":1, "description": "a product", "price": 10.99, "qty": 30 },
        { "SKUId": 2,"itemId":2, "description": "another product", "price": 11.99, "qty": 20 }], 1);

    newRestockOrder(422, "2021/11/29 09:33",
        [{ "SKUId": 234, "description": "a product", "price": 10.99, "qty": 30 },
        { "SKUId": 42, "description": "another product", "price": 11.99, "qty": 20 }], 1);

    newRestockOrder(422, "2021/11/29 09:33",
        [{ "SKUId": 1, "description": "a product", "price": -10.99, "qty": 30 },
        { "SKUId": 2, "description": "another product", "price": 11.99, "qty": 20 }], 1);
    newRestockOrder(422, "2021/11/29 09:33",
        [{ "SKUId": 1, "description": "a product", "price": 10.99, "qty": 30 },
        { "SKUId": 2, "description": "another product", "price": 11.99, "qty": -20 }], 1);


    getRestockOrderIssued(200);
    getAllRestockOrders(200);
    getRestockOrder(200, 1);
    getRestockOrder(404, 200);
    getRestockOrder(422, 'aaa');
    restockOrderItemstoReturn(200, 1, 0);
    restockOrderItemstoReturn(404, 1, 1);
    restockOrderItemstoReturn(422, 'abc', 1);
    modifyState(200, 1, "COMPLETEDRETURN");
    modifyState(422, 'aaa', "COMPLETEDRETURN");
    modifyState(422, 'aaa', "COMPLERETURN");
    modifyState(404, 100, "ISSUED");
    addItemsToRestockOrder(404, 100, [{ "SKUId": 1,"itemId":1, "rfid": "12345678901234567890123456789016" }, { "SKUId": 1,'itemId':2, "rfid": "12345678901234567890123456789017" },], 'no restock order associated to id');
    addItemsToRestockOrder(422, 'aaa', [{ "SKUId": 12, "rfid": "12345678901234567890123456789016" }, { "SKUId": 12, "rfid": "12345678901234567890123456789017" },], 'validation of id failed or restock order state != DELIVERED');
    addItemsToRestockOrder(422, 1, [{ "SKUId": 1, "rfid": "12345678901234567890123456789016" }, { "SKUId": 1, "rfid": "12345678901234567890123456789017" }], 'validation of id failed or restock order state != DELIVERED');
    modifyState(200, 1, "DELIVERED");
    addItemsToRestockOrder(422, 1, [{ "SKUId": 1, "rfid": "12345678901234567890123456789016" }, { "SKUId": 1, "rfid": "12345678901234567890123456789017" }]);
    addTransportNoteToRestockOrder(404, 100, { "deliveryDate": "2021/12/29" }, 'no restock order associated to id', 1);
    addTransportNoteToRestockOrder(422, 'aaa', { "deliveryDate": "2021/12/29" }, 'validation of id failed or restock order state != DELIVERY', 1);

    addItemsToRestockOrder(200, 1, [{ "SKUId": 1,'itemId':1, "rfid": "12345678901234567890123456789016" }, { "SKUId": 1,'itemId':2, "rfid": "12345678901234567890123456789017" }], 'DELIVERED');

    addTransportNoteToRestockOrder(200, 1, { "deliveryDate": "2021/12/29" }, 0);
    addTransportNoteToRestockOrder(422, 1, { "deliveryDate": "2021/12/29" }, 'validation of id failed or restock order state != DELIVERY');
    modifyState(200, 1, "DELIVERY");

    deleteRestockOrder(422, 8);
    deleteRestockOrder(204, 1);
    deleteRestockOrder(422, 'abc');

});



function getAllRestockOrders(expectedHTTPStatus) {
    it(`Getting restock Orders]`, function (done) {
        let ro = {
            issueDate: "2021/11/29 09:33", products: [{ "SKUId": 1,"itemId":1, "description": "a product", "price": 10.99, "qty": 30 },
            { "SKUId": 2,"itemId":2, "description": "another product", "price": 11.99, "qty": 20 }]
            , supplierId: 1
        };
        let expectedResult = [{
            "id": 1,
            "issueDate": "2021/11/29 09:33",
            "state": "ISSUED",
            "products": [{ "SKUId": 1,"itemId":1, "description": "a product", "price": 10.99, "qty": 30 },
            { "SKUId": 2,"itemId":2, "description": "another product", "price": 11.99, "qty": 20 }],
            "supplierId": 1,
            "skuItems": []
        }
        ]
        agent.post('/api/restockOrder')
            .send(ro)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/restockOrders')
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus)
                        done();
                    })


            })
    });
}

function getRestockOrder(expectedHTTPStatus, id, errorMessage) {
    it(`Getting restock Orders by Id`, function (done) {
        let ro = {
            issueDate: "2021/11/29 09:33", products: [{ SKUId: 1, itemId:1, description: "a product", price: 10.99, qty: 30 },
            { SKUId: 2,itemId:2, description: "another product", price: 11.99, qty: 20 }]
            , supplierId: 1
        };

        agent.post('/api/restockOrder')
            .send(ro)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/restockOrders/' + id)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus)

                        done();
                    })


            })
    });
}

function getRestockOrderIssued(expectedHTTPStatus, errorMessage) {
    it(`Getting restock Order in state issued with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/restockOrdersIssued`;
        let ro = {
            issueDate: "2021/11/29 09:33", products: [{ "SKUId": 1,'itemId':1, "description": "a product", "price": 10.99, "qty": 30 },
            { "SKUId": 2,'itemId':2, "description": "another product", "price": 11.99, "qty": 20 }]
            , supplierId: 1
        };
        let expectedResult = [{
            "id": 1,
            "issueDate": "2021/11/29 09:33",
            "state": "ISSUED",
            "products": [{ "SKUId": 1,'itemId':1, "description": "a product", "price": 10.99, "qty": 30 },
            { "SKUId": 2,'itemId':2, "description": "another product", "price": 11.99, "qty": 20 }],
            "supplierId": 1,
            "skuItems": []
        }
        ]
        agent.post('/api/restockOrder')
            .send(ro)
            .then(function (res) {
                res.should.have.status(201);
                agent.get(api)
                    .then(function (r) {
                        r.body.should.be.an('array');
                        r.should.have.status(expectedHTTPStatus)

                        done();
                    })


            })
    });
}

function newRestockOrder(expectedHTTPStatus, issueDate, products, supplierId) {
    it(`Adding a new restock order with params`, function (done) {
        let ro = { issueDate: issueDate, products: products, supplierId: supplierId };
        agent.post('/api/restockOrder')
            .send(ro)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    });
}

function addItemsToRestockOrder(expectedHTTPStatus, id, skuItems, state) {
    it(`Adding restock order Items with params [${[...arguments]?.join(',')}]`, function (done) {
        let ro = { skuItems: skuItems };
        let roitem = {
            issueDate: "2021/11/29 09:33", products: [{ SKUId: 1,itemId:1, description: "a product", price: 10.99, qty: 30 },
            { SKUId: 2,itemId:2, description: "another product", price: 11.99, qty: 20 }]
            , supplierId: 1
        };
        let modstate = { newState: 'DELIVERED' };

        if (state == 'DELIVERED') {

            agent.post('/api/restockOrder')
                .send(roitem)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.put('/api/restockOrder/' + id)
                        .send(modstate)
                        .then(function (res) {
                            res.should.have.status(200);
                            agent.put(`/api/restockOrder/${id}/skuItems`)
                                .send(ro)
                                .then(function (res) {
                                    res.should.have.status(expectedHTTPStatus);
                                    done();
                                })

                        })





                });


        }



        else {
            agent.post('/api/restockOrder')
                .send(roitem)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.put(`/api/restockOrder/${id}/skuItems`)
                        .send(ro)
                        .then(function (res) {
                            res.should.have.status(expectedHTTPStatus);
                            done();
                        })
                        .catch(err => done(err));
                });

        }



    })
}

function addTransportNoteToRestockOrder(expectedHTTPStatus, id, transportNote, state) {
    it(`Adding restock order TransportNote with params [${[...arguments]?.join(',')}]`, function (done) {
        let tn = { transportNote: transportNote };
        let roitem = {
            issueDate: "2021/11/29 09:33", products: [{ SKUId: 1,itemId:1, description: "a product", price: 10.99, qty: 30 },
            { SKUId: 2,itemId:2, description: "another product", price: 11.99, qty: 20 }]
            , supplierId: 1
        };
        let modstate = { newState: 'DELIVERY' };

        if (state == 0) {
            agent.post('/api/restockOrder')
                .send(roitem)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.put('/api/restockOrder/' + id)
                        .send(modstate)
                        .then(function (res) {
                            res.should.have.status(200);
                            agent.put(`/api/restockOrder/${id}/transportNote`)
                                .send(tn)
                                .then(function (r) {
                                    r.should.have.status(expectedHTTPStatus);
                                    done();
                                })

                        })





                });


        }
        else {

            agent.post('/api/restockOrder')
                .send(roitem)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.put(`/api/restockOrder/${id}/transportNote`)
                        .send(tn)
                        .then(function (r) {

                            r.should.have.status(expectedHTTPStatus);
                            done();
                        })


                });
        }


    });
}


function restockOrderItemstoReturn(expectedHTTPStatus, id, state) {
    it(`Getting sku items to be returned of a restock order, given its id`, function (done) {
        let roitem = {
            issueDate: "2021/11/29 09:33", products: [{ SKUId: 1,itemId:1, description: "a product", price: 10.99, qty: 30 },
            { SKUId: 2,itemId:2, description: "another product", price: 11.99, qty: 20 }]
            , supplierId: 1
        };
        let modstate = { newState: 'DELIVERED' };
        let ro = { skuItems: [{ "SKUId": 1,"itemId":1, "rfid": "12345678901234567890123456789016" }, { "SKUId": 1,"itemId":1, "rfid": "12345678901234567890123456789017" }] };
        if (state == 0) {

            agent.post('/api/restockOrder')
                .send(roitem)
                .then(function (res) {
                    res.should.have.status(201);
                    agent.put('/api/restockOrder/' + id)
                        .send(modstate)
                        .then(function (res) {
                            res.should.have.status(200);
                            agent.put(`/api/restockOrder/${id}/skuItems`)
                                .send(ro)
                                .then(function (res) {
                                    res.should.have.status(200);
                                    agent.get(`/api/restockOrders/${id}/returnItems`)
                                        .then(function (res) {
                                            res.should.have.status(expectedHTTPStatus);
                                            done()
                                        })
                                })

                        })





                });
        }
        else {
            agent.get(`/api/restockOrders/${id}/returnItems`)
                .then(function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done()
                })

        }


    })
}




function modifyState(expectedHTTPStatus, id, newState, errorMessage) {
    it(`Modify state of a restock order with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/restockOrder/${id}`;
        let ro = { newState: newState };
        let roitem = {
            issueDate: "2021/11/29 09:33", products: [{ SKUId: 1,itemId:1, description: "a product", price: 10.99, qty: 30 },
            { SKUId: 2,itemId:2, description: "another product", price: 11.99, qty: 20 }]
            , supplierId: 1
        };
        agent.post('/api/restockOrder')
            .send(roitem)
            .then(function (res) {
                res.should.have.status(201);
                agent.get('/api/restockOrders/' + id)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus)
                        agent.put(api).send(ro)
                            .then(function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                if (errorMessage) {
                                    res.body.should.equal(errorMessage);
                                }
                                done();
                            })
                            .catch(err => done(err));
                    });
            })


    })

}

function deleteRestockOrder(expectedHTTPStatus, id, errorMessage) {
    it(`Deleting Return Order with params [${[...arguments]?.join(',')}]`, function (done) {
        let roitem = {
            issueDate: "2021/11/29 09:33", products: [{ SKUId: 1,itemId:1, description: "a product", price: 10.99, qty: 30 },
            { SKUId: 2,itemId:2, description: "another product", price: 11.99, qty: 20 }]
            , supplierId: 1
        };
        let api = `/api/restockOrder/${id}`;
        agent.post('/api/restockOrder')
            .send(roitem)
            .then(function (res) {
                res.should.have.status(201);
                agent.delete(api)
                    .then(function (res) {
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    })
            });

    });
}