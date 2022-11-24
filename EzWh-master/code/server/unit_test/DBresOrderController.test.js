
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
const itemserv = require('../services/itemService')
const skuController = require('../controller/SKUController');
const dao1 = new skuController();
const dao2 = new ItemController();
const sku = new skuserv(dao1);
const item = new itemserv(dao2)
//const { expect } = require('chai');

const dao = new Controller();
const db = new DB('EzWh.db');

db.startConnection();

function productWithItemId(ID, DESCRIPTION, PRICE, QUANTITY, ITEMID) {
    this.ID = ID;
    this.DESCRIPTION = DESCRIPTION;
    this.PRICE = PRICE;
    this.QUANTITY = QUANTITY;
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
    let data = ({
        issueDate: "2021/11/29 09:33",
        products: [{ SKUId: 1, itemId: 1, description: "a product", price: 10.99, qty: 30 },
        { SKUId: 2, itemId: 2, description: "another product", price: 11.99, qty: 20 }],
        supplierId: 1
    })

    let data1 = ({
        issueDate: "2021/11/29 09:33",
        products: [{ SKUId: 3, itemId: 3, description: "a product", price: 10.99, qty: 30 },
        { SKUId: 4, itemId: 4, description: "another product", price: 11.99, qty: 20 }],
        supplierId: 1
    })

    beforeEach(async () => {
        //sku drop table
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
        //add SKU Item 1 and 2,3,4


    });

    //test 


    test('Get all Restock Orders', async () => {
        await dao.storeRestockOrder(data, db);
        await dao.storeRestockOrder(data1, db);


        let product1 = [];
        let product2 = [];
        let sku = await SKU.getSKUById(db, 1);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 30,1));
        sku = await SKU.getSKUById(db, 2);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 20,2));
        sku = await SKU.getSKUById(db, 3);
        product2.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 30,3));
        sku = await SKU.getSKUById(db, 4);
        product2.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 20,4));
        let res = await dao.getRestockOrder(db);
        console.log(res);
        expect(res).toEqual([
            new RESO(1, data.issueDate, 'ISSUED', product1, null, data.supplierId, []),
            new RESO(2, data1.issueDate, 'ISSUED', product2, null, data1.supplierId, [])
        ]);
        await dao.deleteRestockOrder(db, 1);
        res = await dao.getRestockOrder(db)
        expect(res).toEqual([
            new RESO(2, data.issueDate, 'ISSUED', product2, null, data.supplierId, []),
        ]
        );
    });

    test('Get all Restock Orders Issued', async () => {
        await dao.storeRestockOrder(data, db);
        await dao.storeRestockOrder(data1, db);

        let product1 = [];
        let product2 = [];
        let sku = await SKU.getSKUById(db, 1);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 30,1));
        sku = await SKU.getSKUById(db, 2);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 20,2));
        sku = await SKU.getSKUById(db, 3);
        product2.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 30,3));
        sku = await SKU.getSKUById(db, 4);
        product2.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 20,4));

        await dao.modifyState(db, 2, 'DELIVERED');
        let res = await dao.getRestockOrderIssued(db, 'ISSUED');

        expect(res).toEqual([
            new RESO(1, data.issueDate, 'ISSUED', product1, null, data.supplierId, []),
        ]);

    });


    test('Get Restock Orders by ID', async () => {
        await dao.storeRestockOrder(data, db);

        let product1 = [];
        let sku = await SKU.getSKUById(db, 1);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 30,1));
        sku = await SKU.getSKUById(db, 2);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 20,2));

        let res = await dao.getRestockOrderbyID(db, 1);




        expect(res).toEqual(new RESO(1, data.issueDate, 'ISSUED', product1, null, data.supplierId, []));

    });
    test('Get Restock Orders by ID,No ID', async () => {


        async function invalid() {
            return await dao.getRestockOrderbyID(db, 1);
        }

        expect(invalid).rejects.toEqual({ err: 404 });

    });

    test('End Connection Error', async () => {
        db.endConnection();
        await expect(dao.getRestockOrder()).rejects.toThrow();
    });

    test('Modify Status', async () => {
        await dao.storeRestockOrder(data, db);

        let newState = 'DELIVERED';
        let product1 = [];
        let sku = await SKU.getSKUById(db, 1);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 30,1));
        sku = await SKU.getSKUById(db, 2);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 20,2));

        await dao.modifyState(db, 1, newState);

        let res = await dao.getRestockOrderbyID(db, 1);


        expect(res).toEqual(new RESO(1, data.issueDate, 'DELIVERED', product1, null, data.supplierId, []));

    });

    test('Modify Status,NO ID', async () => {

        await dao.storeRestockOrder(data, db);

        let product1 = [];
        let newState = 'DELIVERED';
        let sku = await SKU.getSKUById(db, 1);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 30,1));
        sku = await SKU.getSKUById(db, 2);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 20,2));
        async function invalid() {
            return await dao.modifyState(db, 3, newState);
        }

        expect(invalid).rejects.toEqual({ err: 404 });

    });

    test('ADD skuItems', async () => {
        await dao.storeRestockOrder(data, db);

        let Items = {
            skuItems: [
                { SKUId: 1,itemId: 1, rfid: "12345678901234567890123456789016" },
                { SKUId: 2,itemId:2, rfid: "12345678901234567890123456789017" }
            ]
        }
        let Itemsdef = {
            skuItems: [
                { SKUId: 1,ItemId: 1, rfid: "12345678901234567890123456789016" },
                { SKUId: 2,ItemId:2, rfid: "12345678901234567890123456789017" }
            ]
        }
        let newState = 'DELIVERED';
        await dao.modifyState(db, 1, newState);
        let product1 = [];
        let sku = await SKU.getSKUById(db, 1);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 30,1));
        sku = await SKU.getSKUById(db, 2);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 20,2));

        await dao.addSKUItems(db, 1, Items.skuItems);

        let res = await dao.getRestockOrderbyID(db, 1);


        expect(res).toEqual(new RESO(1, data.issueDate, 'DELIVERED', product1, null, data.supplierId, Itemsdef.skuItems));

    });

    test('Add skuItem,NO ID', async () => {

        await dao.storeRestockOrder(data, db);

        let Items = {
            skuItems: [
                { SKUId: 1, rfid: "12345678901234567890123456789016" },
                { SKUId: 2, rfid: "12345678901234567890123456789017" }
            ]
        }

        let product1 = [];
        let sku = await SKU.getSKUById(db, 1);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 30,1));
        sku = await SKU.getSKUById(db, 2);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 20,2));

        async function invalid() {
            await dao.addSKUItems(db, 3, Items.skuItems);
        }

        expect(invalid).rejects.toEqual({ err: 404 });

    });

    test('Add skuItem,NOT DELIVERED', async () => {

        await dao.storeRestockOrder(data, db);

        let Items = {
            skuItems: [
                { SKUId: 1, rfid: "12345678901234567890123456789016" },
                { SKUId: 2, rfid: "12345678901234567890123456789017" }
            ]
        }

        let product1 = [];
        let sku = await SKU.getSKUById(db, 1);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 30,1));
        sku = await SKU.getSKUById(db, 2);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 20,2));

        async function invalid() {
            await dao.addSKUItems(db, 1, Items.skuItems);
        }

        expect(invalid).rejects.toEqual(422);

    });
    //test transport Note

    test('ADD transportNote', async () => {



        let tn = {
            transportNote: { deliveryDate: "2021/12/29" }
        }
        await dao.storeRestockOrder(data, db);
        let newState = 'DELIVERY';
        await dao.modifyState(db, 1, newState);

        let product1 = [];
        let sku = await SKU.getSKUById(db, 1);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 30,1));
        sku = await SKU.getSKUById(db, 2);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 20,2));

        await dao.addTradportNote(db, 1, tn.transportNote);

        let res = await dao.getRestockOrderbyID(db, 1);


        expect(res).toEqual(new RESO(1, data.issueDate, 'DELIVERY', product1, tn.transportNote, data.supplierId, []));

    });

    test('Add transport Note,NO ID', async () => {

        await dao.storeRestockOrder(data, db);

        let tn = {
            transportNote: { deliveryDate: "2021/12/29" }
        }


        let product1 = [];
        let sku = await SKU.getSKUById(db, 1);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 30,1));
        sku = await SKU.getSKUById(db, 2);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 20,2));

        async function invalid() {
            await dao.addTradportNote(db, 3, tn.transportNote);
        }

        expect(invalid).rejects.toEqual({ err: 404 });

    });
    test('Add transport Note,NOT delivered', async () => {

        await dao.storeRestockOrder(data, db);

        let tn = {
            transportNote: { deliveryDate: "2021/12/29" }
        }


        let product1 = [];
        let sku = await SKU.getSKUById(db, 1);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 30,1));
        sku = await SKU.getSKUById(db, 2);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 20,2));

        async function invalid() {
            await dao.addTradportNote(db, 1, tn.transportNote);
        }

        expect(invalid).rejects.toEqual(422);

    });

    //test on no quality test item after test result

    test('ADD skuItems', async () => {
        await dao.storeRestockOrder(data, db);

        let Items = {
            skuItems: [
                { SKUId: 1,itemId:1, rfid: "12345678901234567890123456789016" },
                { SKUId: 2,itemId:2, rfid: "12345678901234567890123456789017" }
            ]
        }
        
        let newState = 'DELIVERED';
        await dao.modifyState(db, 1, newState);
        let product1 = [];
        let sku = await SKU.getSKUById(db, 1);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 30,1));
        sku = await SKU.getSKUById(db, 2);
        product1.push(new productWithItemId(sku.ID, sku.DESCRIPTION, sku.PRICE, 20,2));

        await dao.addSKUItems(db, 1, Items.skuItems);

        let res = await dao.returnItemsNOQt(db, 1);


        expect(res).toEqual([{
            SKUId: 2,itemId:2, rfid: "12345678901234567890123456789017"
        }]);

    });
});
