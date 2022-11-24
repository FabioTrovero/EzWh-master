'use strict'
const dao = require('../mockDB/mockItemController');
const Item = require('../classes/item');
const ItemService = require('../services/itemService');
//const { expect } = require('chai');

const serv = new ItemService(dao)

describe('get All Item',() =>{
    let itemList = [];
    let data  =  {
        id : 1,
        description : "item",
        price : 10.99,
        SKUId : 1,
        supplierId : 2
    }
    
    itemList.push(new Item(data.id,data.description,data.price,data.SKUId,data.supplierId));
    let data1  =  {
        id : 2,
        description : "a new item",
        price : 10.99,
        SKUId : 1,
        supplierId : 2
    }
    itemList.push(new Item(data1.id,data1.description,data1.price,data1.SKUId,data1.supplierId));

    beforeEach(()=>{
        dao.getStoreItem.mockReset();
        dao.getStoreItem.mockReturnValueOnce(itemList);
    })

    test('get All Users',async() => {
        let res= await serv.getAllItem(undefined);

        expect(res.length).toStrictEqual(itemList.length);
        expect(res).toStrictEqual(
        [
        {
        id : 1,
        description : "item",
        price : 10.99,
        SKUId : 1,
        supplierId : 2
        },
        {
        id : 2,
        description : "a new item",
        price : 10.99,
        SKUId : 1,
        supplierId : 2

        }
    ]);
    })


})


describe('get Item by ID',() =>{
    let item
    let data  =  {
        id : 1,
        description : "item",
        price : 10.99,
        SKUId : 1,
        supplierId : 2
    }
    
    item=(new Item(data.id,data.description,data.price,data.SKUId,data.supplierId));
    
    beforeEach(()=>{
        dao.getStoreItembyID.mockReset();
        dao.getStoreItembyID.mockReturnValueOnce(item);
    })

    test('get User by ID',async() => {
        let res= await serv.getItem(undefined, 1, 2);

        expect(res).toStrictEqual(
        {
        id : 1,
        description : "item",
        price : 10.99,
        SKUId : 1,
        supplierId : 2
        });
    })
    })









