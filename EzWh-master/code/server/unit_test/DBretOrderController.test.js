'use strict'
const Controller = require('../controller/returnOrderController');
const retO = require('../classes/returnOrder');
const DB = require('../database/EzWh_Database.js');
const SKUController = require('../controller/SKUController');
const resOcontroller = require('../controller/restockOrderController')
const ItemController = require('../controller/ItemController');
const resO = new resOcontroller();
const SKU = new SKUController();
const skuserv = require('../services/SKUService')
const skuController = require('../controller/SKUController');
const dao1 = new skuController();
const sku = new skuserv(dao1);
const dao2 = new ItemController();
//const { expect } = require('chai');

const dao = new Controller();
const db = new DB('EzWh.db');

db.startConnection();

function productWithItemId(SKUID, description, price, RFID,ITEMID) {
    this.SKUID = SKUID;
    this.description = description;
    this.price = price;
    this.RFID = RFID;
    this.ITEMID = ITEMID;
}
describe('Persistence Tests', () => {
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
        products: [{ SKUId: 1, itemId: 1, description: "a product", price: 10.99, qty: 30 },
        { SKUId: 2, itemId: 2, description: "another product", price: 11.99, qty: 20 }],
        supplierId: 1
    })

    let d1 = ({
        issueDate: "2021/11/29 09:33",
        products: [{ SKUId: 3, itemId: 3, description: "a product", price: 10.99, qty: 30 },
        { SKUId: 4, itemId: 4, description: "another product", price: 11.99, qty: 20 }],
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

    beforeEach(async () => {

        db.startConnection();
        await dao2.resetTable(db)
        await resO.resetTable(db);
        await dao1.resetTable(db);
        await sku.create(db, sku1);
        await sku.create(db, sku2);
        await sku.create(db, sku3);
        await sku.create(db, sku4);
        await dao2.storeItem(item1, db);
        await dao2.storeItem(item2, db);
        await dao2.storeItem(item3, db);
        await dao2.storeItem(item4, db);


        await dao.resetTable(db);



    });

    //test 


    test('Get all Return Orders', async () => {
        await resO.storeRestockOrder(d, db);
        await resO.storeRestockOrder(d1, db);
        await dao.storeReturnOrder(data, db);
        await dao.storeReturnOrder(data1, db);


        let product1 = [];
        let product2 = [];
        let sku = await SKU.getSKUById(db, 1);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, "12345678901234567890123456789016",1));
        sku = await SKU.getSKUById(db, 2);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, '12345678901234567890123456789038',2));
        sku = await SKU.getSKUById(db, 3);
        product2.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, '12345678901234567890123456789016',3));
        sku = await SKU.getSKUById(db, 4);
        product2.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, '12345678901234567890123456789038',4));
        let res = await dao.getReturnOrder(db);

        expect(res).toEqual([
            new retO(1, data.returnDate, product1, data.restockOrderId),
            new retO(2, data1.returnDate, product2, data1.restockOrderId)
        ]);
        await dao.deleteReturnOrderbyId(1, db);
        res = await dao.getReturnOrder(db)
        expect(res).toEqual([
            new retO(2, data1.returnDate, product2, data1.restockOrderId)
        ]
        );
    });

    test('Get all Return Orders, no restockOrderID', async () => {
        async function invalid() {
            return await dao.storeReturnOrder(data1, db)
        }

        expect(invalid).rejects.toEqual({ err: 404 });
    });

    test('End Connection Error', async () => {
        db.endConnection();
        await expect(dao.getReturnOrder()).rejects.toThrow();
    });

    test('Get Return Orders by ID', async () => {

        await resO.storeRestockOrder(d, db);
        await dao.storeReturnOrder(data, db);


        let product1 = [];
        let sku = await SKU.getSKUById(db, 1);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, "12345678901234567890123456789016",1));
        sku = await SKU.getSKUById(db, 2);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, '12345678901234567890123456789038',2));
        let res = await dao.getReturnOrderbyID(db, 1);

        expect(res).toEqual(
            new retO(1, data.returnDate, product1, data.restockOrderId),
        );
    });
    test('Get Return Orders by ID, no ID', async () => {

        await resO.storeRestockOrder(d, db);
        await dao.storeReturnOrder(data, db);


        let product1 = [];
        let sku = await SKU.getSKUById(db, 1);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, "12345678901234567890123456789016",1));
        sku = await SKU.getSKUById(db, 2);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, '12345678901234567890123456789038',2));


        async function invalid() {
            return await dao.getReturnOrderbyID(db, 3);
        }

        expect(invalid).rejects.toEqual(404);
    });
});