/**
 * Created by hni on 2015/8/11.
 */


'use strict';

var MAPPING = require('framework').mapping;
var LOCATOR = require('framework').locator;
var API = require('framework').api;
var PCMAPPING = require('./price-condition-mapping');
var PCDATA = require('./price-condition-data');

describe('price condition header container test', function () {

    var kw;

    beforeEach(function () {
        kw = API.createNewAPI();
    });

    afterEach(function () {
        kw = null;
    });

    it('test  open price condition  module', function () {
        kw.openAdministrationModule('Price Condition');
        console.log('open price condition header successfully');
        kw.maxContainerLayout(0, 'Price Condition');
    });
    it('test the price condition header container works,click the refresh and it will load data', function () {
        kw.selectGrid(PCMAPPING.pcHeaderGrid);
        kw.clickRefresh();
        kw.clickGoToNext();
        kw.selectGrid(PCMAPPING.pcHeaderGrid).count().then(function (count) {
            expect(count).not.toBe(0);
            console.log('price condition header load data successfully')
        });
    });
    it('test  add is working ', function () {
        kw.selectGrid(PCMAPPING.pcHeaderGrid).count().then(function (beforeAdd) {
            kw.clickAdd();
            kw.selectGrid(PCMAPPING.pcHeaderGrid).count().then(function (afteradd) {
                expect(afteradd).toBe(beforeAdd + 1);
                console.log('add root record button works');
            });
        });
    });
    it('test  delete button is working ', function () {
        kw.selectGrid(PCMAPPING.pcHeaderGrid).count().then(function (beforedelete) {
            kw.clickDelete();
            kw.selectGrid(PCMAPPING.pcHeaderGrid).count().then(function (afterdelete) {
                expect(afterdelete).toBe(beforedelete - 1);
                console.log('delete button works');
            });
        });
    });

    it('test  save and search are working', function () {
        kw.selectGrid(PCMAPPING.pcHeaderGrid);
        kw.clickAdd();
        kw.selectGrid(PCMAPPING.pcHeaderGrid).count().then(function (afteradd) {
            afteradd--;
            kw.selectGridRow(afteradd);
            kw.modifyCellValueByColumnName('Description',PCDATA.PRICE_CONDITION_HEADER.TEST_SAVE_SEARCH_CASE.DESCRIPTION);
            kw.clickCheckBoxByColumnName('Is Default');
            kw.shiftAwayCursor('Description');
            kw.clickSave();
            kw.clickRefresh();
            kw.clickGoToNext();
            kw.sleep();
            kw.selectGrid(PCMAPPING.pcHeaderGrid).count().then(function (count) {
                expect(count).toBe(afteradd+1);
                console.log('save and search button are working');
                kw.selectGridRowByAssignCode(PCDATA.PRICE_CONDITION_HEADER.TEST_SAVE_SEARCH_CASE.DESCRIPTION);
                kw.clickDelete();
                kw.clickSave();
            });
        });
    });
});
