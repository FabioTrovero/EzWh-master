'use strict'
const Controller = require('../controller/returnOrderController');
const retO = require('../classes/returnOrder');
const DB = require('../database/EzWh_Database.js');
const SKUController = require('../controller/SKUController');
const resOcontroller = require('../controller/restockOrderController')
const resO = new resOcontroller();
const ItemController = require('../controller/ItemController');
const skuserv = require('../services/SKUService')
const dao1 = new SKUController();
const sku = new skuserv(dao1);
const dao2 = new ItemController();

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
const ro = {
    "issueDate": "2021/11/29 09:33",
    "products": [{ "SKUId": 12, "description": "a product", "price": 10.99, "qty": 30 },
    { "SKUId": 180, "description": "another product", "price": 11.99, "qty": 20 }],
    "supplierId": 1
}
const reto = {
    "returnDate": "2021/11/29 09:33",
    "products": [{ "SKUId": 12, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
    { "SKUId": 180, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" }],
    "restockOrderId": 1
}
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
let d = ({
    issueDate: "2021/11/29 09:33",
    products: [{ SKUId: 1,itemId:1, description: "a product", price: 10.99, qty: 30 },
    { SKUId: 2,itemId:2, description: "another product", price: 11.99, qty: 20 }],
    supplierId: 1
})

let d1 = ({
    issueDate: "2021/11/29 09:33",
    products: [{ SKUId: 3,itemId:3, description: "a product", price: 10.99, qty: 30 },
    { SKUId: 4,itemId:4, description: "another product", price: 11.99, qty: 20 }],
    supplierId: 1
})

let data = (
    {
        returnDate: "2021/11/29 09:33",
        products: [{ SKUId: 1,itemId:1, description: "a product", price: 10.99, RFID: "12345678901234567890123456789016" },
        { SKUId: 2,itemId:2, description: "another product", price: 11.99, RFID: "12345678901234567890123456789038" }],
        restockOrderId: 1
    })

let data1 = ({
    returnDate: "2021/11/29 09:33",
    products: [{ SKUId: 3,itemId:3, description: "a product", price: 10.99, RFID: "12345678901234567890123456789016" },
    { SKUId: 4,itemId:4, description: "another product", price: 11.99, RFID: "12345678901234567890123456789038" }],
    restockOrderId: 2
})


describe('Test return Orders APIs', () => {

    beforeEach(async () => {

        db.startConnection();
        await resO.resetTable(db);
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
        await resO.storeRestockOrder(d, db);
        await resO.storeRestockOrder(d1, db);

        await dao.resetTable(db);
        await dao.storeReturnOrder(data, db);
        await dao.storeReturnOrder(data1, db)



    });



    newReturnOrder(201, "2021/11/29 09:33",
        [{ "SKUId": 1, "itemId":1,"description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
        { "SKUId": 2,"itemId":2, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" },], 1);
    newReturnOrder(404, "2021/11/29 09:33",
        [{ "SKUId": 1, "itemId":1,"description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
        { "SKUId": 2,"itemId":2, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" },], 56);
    newReturnOrder(422, "/11/29 09:33",
        [{ "SKUId": 1,"itemId":1, "description": "a product", "price": 10.99, "RFID": "12345678901234567890123456789016" },
        { "SKUId": 2,"itemId":2, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" },], 1);

    newReturnOrder(422, "2021/11/29 09:33",
        [{ "SKUId": 1,"itemId":1, "description": "a product", "price": -10.99, "RFID": "12345678901234567890123456789016" },
        { "SKUId": 2,"itemId":1, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" },], 1);
    newReturnOrder(422, "2021/11/29 09:33",
        [{ "SKUId": 1,"itemId":1, "description": "a product", "price": 10.99, "RFID": "a" },
        { "SKUId": 2,"itemId":1, "description": "another product", "price": 11.99, "RFID": "12345678901234567890123456789038" },], 1);
    newReturnOrder(422, "2021/11/29 09:33");
    newReturnOrder(422, '');

    getAllReturnOrders(200);
    getReturnOrder(200, 1);
    getReturnOrder(404, 200);
    getReturnOrder(422, 'aaa');

    deleteReturnOrder(204, 1);
    deleteReturnOrder(422, 'aaa');
    deleteReturnOrder(422, 67);
});



function getAllReturnOrders(expectedHTTPStatus) {
    it(`Getting return Orders with params [${[...arguments]?.join(',')}]`, function (done) {
        agent.get(`/api/returnOrders`)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                res.body.forEach(r => {
                    expect(r.id).not.to.be.undefined;
                    expect(r.returnDate).not.to.be.undefined;
                    r.products.forEach(p => {
                        expect(p.SKUId).not.to.be.undefined;
                        expect(p.description).not.to.be.undefined;
                        expect(p.price).not.to.be.undefined;
                        expect(p.RFID).not.to.be.undefined;
                    });
                    expect(r.restockOrderId).not.to.be.undefined;
                })
                done();
            })
            .catch(err => done(err));
    });
}

function getReturnOrder(expectedHTTPStatus, id) {
    it(`Getting return Order with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/returnOrders/${id}`;
        agent.get(api)
            .then(function (res) {
                console.log(res.status)
                res.should.have.status(expectedHTTPStatus);
                if (res.status == 404 || 422) {
                    done()
                }
                else {
                    expect(res.body.id).not.to.be.undefined;
                    expect(res.body.returnDate).not.to.be.undefined;
                    res.body.products.forEach(p => {
                        expect(p.SKUId).not.to.be.undefined;
                        expect(p.description).not.to.be.undefined;
                        expect(p.price).not.to.be.undefined;
                        expect(p.RFID).not.to.be.undefined;
                    });
                    expect(res.body.restockOrderId).not.to.be.undefined;
                    done();
                }
            })
            .catch(err => done(err));
    });
}

function newReturnOrder(expectedHTTPStatus, returnDate, products, restockOrderId, errorMessage) {
    it(`Adding a new return order with params [${[...arguments]?.join(',')}]`, function (done) {
        let ro = { returnDate: returnDate, products: products, restockOrderId: restockOrderId };
        agent.post('/api/returnOrder')
            .send(ro)
            .then(function (res) {
                console.log(res.status)
                res.should.have.status(expectedHTTPStatus);
                done();
            })
    });
}

function deleteReturnOrder(expectedHTTPStatus, id) {
    it(`Deleting Return Order with params [${[...arguments]?.join(',')}]`, function (done) {
        let api = `/api/returnOrder/${id}`;
        agent.delete(api)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            })
            .catch(err => done(err));
    });
}
