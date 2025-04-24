/**
 * Created by hni on 2015/8/11.
 */


'use strict';

var MAPPING = require('framework').mapping;
var LOCATOR = require('framework').locator;
var API = require('framework').api;
var PCMAPPING = require('./price-condition-mapping');
var PCDATA = require('./price-condition-data');

describe('price condition detail container test', function () {

    var kw;

    beforeEach(function () {
        kw = API.createNewAPI();
    });

    afterEach(function () {
        kw = null;
    });

    it('test open price condition detail  module', function () {
        kw.openAdministrationModule('Price Condition');
        kw.selectLayout(0,'Layout 1');
        kw.chooseContainerForOneLayout(0,'Price Condition');
        kw.chooseContainerForOneLayout(2,'Price Condition Details');
        console.log('open Price Condition Details container successfully');
        kw.clickLayoutOk();
        kw.selectGrid(PCMAPPING.pcHeaderGrid);
        kw.clickRefresh();
        kw.selectGridRowByAssignCode(PCDATA.CONTAINER_SEARCH);
    });
    it('test the price condition detail container works,click the refresh and it will load data', function () {
        kw.selectGrid(PCMAPPING.pcDetailGrid);
        kw.selectGrid(PCMAPPING.pcDetailGrid).count().then(function (count) {
            expect(count).not.toBe(0);
            console.log('price condition detail load data successfully')
        });
    });
    it('test  add root and delete button are working ', function () {
        kw.selectGrid(PCMAPPING.pcDetailGrid);
        kw.selectGrid(PCMAPPING.pcDetailGrid).count().then(function (beforeAdd) {
            kw.clickAdd();
            kw.selectGrid(PCMAPPING.pcDetailGrid).count().then(function (afteradd) {
                expect(afteradd).toBe(beforeAdd + 1);
                console.log('add root record button works');
            });
        });
        kw.selectGrid(PCMAPPING.pcDetailGrid).count().then(function (beforedelete) {
            kw.clickDelete();
            kw.selectGrid(PCMAPPING.pcDetailGrid).count().then(function (afterdelete) {
                expect(afterdelete).toBe(beforedelete - 1);
                console.log('delete button works');
            });
        });
    });


    it('test  save and search are working', function () {
        kw.selectGrid(PCMAPPING.pcDetailGrid);
        kw.clickAdd();
        kw.selectGrid(PCMAPPING.pcDetailGrid).count().then(function (afteradd) {
            afteradd--;
            kw.selectGridRow(afteradd);
            kw.modifyDropDownLookupByColumnName('Price Condition Type',PCDATA.PRICE_CONDITION_DETAIL.TEST_SAVE_SEARCH_CASE.PRICE_CONDITION_TYPE);
            kw.modifyCellValueByColumnName('Value',PCDATA.PRICE_CONDITION_DETAIL.TEST_SAVE_SEARCH_CASE.VALUE);
            kw.shiftAwayCursor('Price Condition Type Description');
            kw.clickSave();
           // kw.clickRefresh();
            //kw.clickGoToNext();
            kw.selectGrid(PCMAPPING.pcDetailGrid).count().then(function (count) {
                expect(count).toBe(afteradd+1);
                console.log('save and search button are working');
                kw.selectGridRowByAssignCode(PCDATA.PRICE_CONDITION_DETAIL.TEST_SAVE_SEARCH_CASE.VALUE);
                kw.shiftAwayCursor('Price Condition Type Description');
                kw.clickDelete();
                kw.clickSave();
            });

        });
    });

});
