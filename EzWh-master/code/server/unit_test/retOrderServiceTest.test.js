'use strict'
const dao = require('../mockDB/mockretOrderController');
const retO = require('../classes/returnOrder');
const retOService = require('../services/returnOrderService');
//const { expect } = require('chai');

const serv = new retOService(dao)

describe('test DTO', () => {
    let roList = [];

    roList.push(new retO(1, "2021/11/29 09:33", [{ SKUID: 1, ITEMID: 1, description: "a product", price: 10.99, RFID: "12345678901234567890123456789016" },
    { SKUID: 2, ITEMID: 2, description: "another product", price: 11.99, RFID: "12345678901234567890123456789038" }], 1));

    roList.push(new retO(2, "2021/11/29 09:33", [{ SKUID: 3, ITEMID: 3, description: "a product", price: 10.99, RFID: "12345678901234567890123456789016" },
    { SKUID: 4, ITEMID: 4, description: "another product", price: 11.99, RFID: "12345678901234567890123456789038" }], 2));

    beforeEach(() => {
        dao.storeReturnOrder.mockReset();
        dao.getReturnOrder.mockReturnValueOnce(roList);
    })

    test('get All ', async () => {

        let res = await serv.getAllretO(undefined);

        expect(res.length).toStrictEqual(roList.length);
        expect(res).toEqual(
            [
                {
                    id: 1,
                    returnDate: "2021/11/29 09:33",
                    products: [{ SKUId: 1, itemId: 1, description: "a product", price: 10.99, RFID: '12345678901234567890123456789016' },
                    { SKUId: 2, itemId: 2, description: "another product", price: 11.99, RFID: '12345678901234567890123456789038' }],
                    restockOrderId: 1,
                },
                {
                    id: 2,
                    returnDate: "2021/11/29 09:33",
                    products: [{ SKUId: 3, itemId: 3, description: "a product", price: 10.99, RFID: '12345678901234567890123456789016' },
                    { SKUId: 4, itemId: 4, description: "another product", price: 11.99, RFID: '12345678901234567890123456789038' }],
                    restockOrderId: 2
                }

            ]

        );
    })
})

describe('test DTO by ID', () => {

    let ro = [];

    ro = (new retO(1, "2021/11/29 09:33", [{ SKUID: 1,ITEMID:1, description: "a product", price: 10.99, RFID: "12345678901234567890123456789016" },
    { SKUID: 2,ITEMID:2, description: "another product", price: 11.99, RFID: "12345678901234567890123456789038" }], 1));


    beforeEach(() => {
        dao.storeReturnOrder.mockReset();
        dao.getReturnOrderbyID.mockReturnValueOnce(ro);
    })

    test('get by ID', async () => {

        let res = await serv.getRetObyId(undefined, 1);

        expect(res).toEqual(

            {
                id: 1,
                returnDate: "2021/11/29 09:33",
                products: [{ SKUId: 1,itemId:1, description: "a product", price: 10.99, RFID: '12345678901234567890123456789016' },
                { SKUId: 2,itemId:2, description: "another product", price: 11.99, RFID: '12345678901234567890123456789038' }],
                restockOrderId: 1,
            }


        );
    })


})

