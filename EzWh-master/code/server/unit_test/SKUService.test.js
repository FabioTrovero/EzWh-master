'use strict'
const dao = require('../mockDB/mockSKUController');
const Service = require('../services/SKUService');
//const { expect } = require('chai');

const serv = new Service(dao)
describe('test DTO All',() =>{
    let List= [];
    
    List.push( {
        ID :1,
        DESCRIPTION : 'a product',
        WEIGHT : 100,
        VOLUME : 50,
        PRICE: 10.99,
        NOTES : 'first SKU',
        QUANTITY : 50,
        POSITIONID: null,
        testDescriptors: [1]

    });
    List.push({
        ID :2,
        DESCRIPTION : 'another product',
        WEIGHT : 100,
        VOLUME : 50,
        PRICE: 10.99,
        NOTES : 'second SKU',
        QUANTITY : 50,
        POSITIONID: "800234523412",
        testDescriptors: []

    })


    
    beforeEach(()=>{
        dao.createSKU.mockReset();
        dao.getSKUs.mockReturnValueOnce(List);
    })

    test('get All ',async() => {
        
        let res= await serv.getAllSKUs(undefined);

        expect(res.length).toStrictEqual(List.length);
        expect(res).toEqual( 
            [
                {
                    id: 1,
                    description: 'a product',
                    weight: 100,
                    volume: 50,
                    notes: 'first SKU',
                    position: "",
                    availableQuantity: 50,
                    price: 10.99,
                    testDescriptors: [1]
                },
                {
                    id: 2,
                    description: 'another product',
                    weight: 100,
                    volume: 50,
                    notes: 'second SKU',
                    position : "800234523412",
                    availableQuantity: 50,
                    price: 10.99,
                    testDescriptors: []
                },

            ]
        
               
    );
    })
})
describe('test DTO All',() =>{
    
    let List = ( {
        ID :1,
        DESCRIPTION : 'a product',
        WEIGHT : 100,
        VOLUME : 50,
        PRICE: 10.99,
        NOTES : 'first SKU',
        QUANTITY : 50,
        POSITIONID: "800234523412",
        testDescriptors: [1]

    });
    

    
    beforeEach(()=>{
        dao.createSKU.mockReset();
        dao.getSKUById.mockReturnValueOnce(List);
    })

    test('get All ',async() => {
        
        let res= await serv.getSKUByIdServ(undefined,1);

        expect(res).toEqual( 
                {
                    description: 'a product',
                    weight: 100,
                    volume: 50,
                    notes: 'first SKU',
                    position : "800234523412",
                    availableQuantity: 50,
                    price: 10.99,
                    testDescriptors: [1]
                }
               
    );
    })
})