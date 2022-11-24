'use strict'
const dao = require('../mockDB/mockresOrderController');
const RESO = require('../classes/restockOrder');
const resOService = require('../services/restockOrderService');
//const { expect } = require('chai');

const serv = new resOService(dao)

describe('test DTO', () => {
    let roList = [];

    roList.push(new RESO(1, "2021/11/29 09:33", 'ISSUED', [{ ID: 1, ITEMID: 1, DESCRIPTION: "a product", PRICE: 10.99, QUANTITY: 30 },
    { ID: 2, ITEMID: 2, DESCRIPTION: "another product", PRICE: 11.99, QUANTITY: 20 }], null, 1, []))

    roList.push(new RESO(2, "2021/11/29 09:33", 'ISSUED', [{ ID: 3, ITEMID: 3, DESCRIPTION: "a product", PRICE: 10.99, QUANTITY: 30 },
    { ID: 4, ITEMID: 4, DESCRIPTION: "another product", PRICE: 11.99, QUANTITY: 20 }], null, 1, [{ SKUId: 3, ItemId: 3, rfid: "12345678901234567890123456789016" },
    { SKUId: 4, ItemId: 4, rfid: "12345678901234567890123456789017" }]))


    beforeEach(() => {
        dao.storeRestockOrder.mockReset();
        dao.getRestockOrder.mockReturnValueOnce(roList);
    })

    test('get All ', async () => {

        let res = await serv.getAllresO(undefined);

        expect(res.length).toStrictEqual(roList.length);
        expect(res).toEqual(
            [
                {
                    id: 1,
                    issueDate: "2021/11/29 09:33",
                    state: "ISSUED",
                    products: [{ SKUId: 1, itemId: 1, description: "a product", price: 10.99, qty: 30 },
                    { SKUId: 2, itemId: 2, description: "another product", price: 11.99, qty: 20 }],
                    supplierId: 1,
                    skuItems: []
                },
                {
                    id: 2,
                    issueDate: "2021/11/29 09:33",
                    state: "ISSUED",
                    products: [{ SKUId: 3, itemId: 3, description: "a product", price: 10.99, qty: 30 },
                    { SKUId: 4, itemId: 4, description: "another product", price: 11.99, qty: 20 }],
                    supplierId: 1,
                    skuItems: [{ SKUId: 3, itemId: 3, rfid: "12345678901234567890123456789016" },
                    { SKUId: 4, itemId: 4, rfid: "12345678901234567890123456789017" }

                    ]
                }

            ]

        );
    })
})

describe('test DTO by ID', () => {

    let ro = new RESO(1, "2021/11/29 09:33", 'ISSUED', [{ ID: 1, ITEMID: 1, DESCRIPTION: "a product", PRICE: 10.99, QUANTITY: 30 },
    { ID: 2, ITEMID: 2, DESCRIPTION: "another product", PRICE: 11.99, QUANTITY: 20 }], null, 1, [])


    beforeEach(() => {
        dao.storeRestockOrder.mockReset();
        dao.getRestockOrderbyID.mockReturnValueOnce(ro);
    })

    test('get by ID', async () => {

        let res = await serv.getResObyId(undefined);

        expect(res).toEqual(

            {
                id: 1,
                issueDate: "2021/11/29 09:33",
                state: "ISSUED",
                products: [{ SKUId: 1, itemId: 1, description: "a product", price: 10.99, qty: 30 },
                { SKUId: 2, itemId: 2, description: "another product", price: 11.99, qty: 20 }],
                supplierId: 1,
                skuItems: []
            }


        );
    })


})

describe('test DTO ISSUED', () => {
    let roList = [];

    roList.push(new RESO(1, "2021/11/29 09:33", 'ISSUED', [{ ID: 3, ITEMID: 3, DESCRIPTION: "a product", PRICE: 10.99, QUANTITY: 30 },
    { ID: 4, ITEMID: 4, DESCRIPTION: "another product", PRICE: 11.99, QUANTITY: 20 }], null, 1, [{ SKUId: 3, ItemId: 3, rfid: "12345678901234567890123456789016" },
    { SKUId: 4, ItemId: 4, rfid: "12345678901234567890123456789017" }]))

    beforeEach(() => {
        dao.storeRestockOrder.mockReset();
        dao.getRestockOrderIssued.mockReturnValueOnce(roList);
    })

    test('get All ', async () => {

        let res = await serv.getresObyState(undefined, 'ISSUED');

        expect(res.length).toStrictEqual(roList.length);
        expect(res).toEqual(
            [
                {

                    id: 1,
                    issueDate: "2021/11/29 09:33",
                    state: "ISSUED",
                    products: [{ SKUId: 3, itemId: 3, description: "a product", price: 10.99, qty: 30 },
                    { SKUId: 4, itemId: 4, description: "another product", price: 11.99, qty: 20 }],
                    supplierId: 1,
                    skuItems: [{ SKUId: 3, itemId: 3, rfid: "12345678901234567890123456789016" },
                    { SKUId: 4, itemId: 4, rfid: "12345678901234567890123456789017" }]

                }

            ]

        );
    })
})



