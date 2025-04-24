/**
 * Created by hni on 2015/8/13
 */

'use strict';

var MAPPING = require('framework').mapping;
var LOCATOR = require('framework').locator;
var API = require('framework').api;
var MDCMAPPING = require('./material-mapping');
var MDCDATA = require('./material-data');

describe('test material  header container', function () {

    var kw;

    beforeEach(function () {
        kw = API.createNewAPI();
    });

    afterEach(function () {
        kw = null;
    });

    it('material  header  Open Module', function () {
        kw.openWorkspaceModule('Material');
        console.log('open Material header module successfully');
        kw.maxContainerLayout(0, 'Material Records');
    });
    it('test the header container works,click the refresh and it will load data', function () {
        kw.selectGrid(MDCMAPPING.headerGrid);
        kw.clickRefresh();
        kw.selectGrid(MDCMAPPING.headerGrid).count().then(function (count) {
            expect(count).not.toBe(0);
            console.log('material header load data successfully');
        });
    });
    it('test  add and delete button are working ', function () {
        kw.selectGrid(MDCMAPPING.headerGrid);
        kw.selectGrid(MDCMAPPING.headerGrid).count().then(function (beforeAdd) {
            kw.clickAdd();
            kw.selectGrid(MDCMAPPING.headerGrid).count().then(function (afteradd) {
                expect(afteradd).toBe(beforeAdd + 1);
                console.log('add button works');
            });
        });
        kw.selectGrid(MDCMAPPING.headerGrid).count().then(function (beforedelete) {
            kw.clickDelete();
            kw.selectGrid(MDCMAPPING.headerGrid).count().then(function (afterdelete) {
                expect(afterdelete).toBe(beforedelete - 1);
                console.log('delete button works');
            });
        });
    });
    it('test  save and search are working', function () {
        kw.selectGrid(MDCMAPPING.headerGrid);
        kw.clickAdd();
        kw.selectGrid(MDCMAPPING.headerGrid).count().then(function (afteradd) {
            afteradd--;
            kw.selectGridRow(afteradd);
           // kw.modifyDropDownLookupByColumnName('Material Group', MDCDATA.MATERIAL_RECORD.TEST_SAVE_SEARCH_CASE.MATERIAL_GROUP);
            kw.modifyCellValueByColumnName('Code', MDCDATA.MATERIAL_RECORD.TEST_SAVE_SEARCH_CASE.CODE);
            kw.modifyCellValueByColumnName('Match Code', MDCDATA.MATERIAL_RECORD.TEST_SAVE_SEARCH_CASE.MATCH_CODE);
            kw.modifyCellValueByColumnName('Description', MDCDATA.MATERIAL_RECORD.TEST_SAVE_SEARCH_CASE.DESCRIPTION);
            kw.modifyCellValueByColumnName('Further Description', MDCDATA.MATERIAL_RECORD.TEST_SAVE_SEARCH_CASE.FURTHER_DESCRIPTION);
            kw.modifyComboLookupCellByColumnName('ABC Group', MDCDATA.MATERIAL_RECORD.TEST_SAVE_SEARCH_CASE.ABC_GROUP);
            kw.modifyComboLookupCellByColumnName('Currency', MDCDATA.MATERIAL_RECORD.TEST_SAVE_SEARCH_CASE.CURRENCY);
            kw.modifyDropDownLookupByColumnName('UoM', MDCDATA.MATERIAL_RECORD.TEST_SAVE_SEARCH_CASE.UOM);
            kw.modifyCellValueByColumnName('Retail Price', MDCDATA.MATERIAL_RECORD.TEST_SAVE_SEARCH_CASE.RETAIL_PTICE);
            kw.modifyCellValueByColumnName('List Price', MDCDATA.MATERIAL_RECORD.TEST_SAVE_SEARCH_CASE.LIST_PRICE);
            kw.modifyCellValueByColumnName('Discount %', MDCDATA.MATERIAL_RECORD.TEST_SAVE_SEARCH_CASE.DISCOUNT);
            kw.modifyCellValueByColumnName('Charges', MDCDATA.MATERIAL_RECORD.TEST_SAVE_SEARCH_CASE.CHARGES);
            kw.shiftAwayCursor('Discount %');
            kw.clickSave();
            kw.clickSearchWithInputValue(MDCDATA.MATERIAL_RECORD.TEST_SAVE_SEARCH_CASE.CODE);
            kw.clickGoToNext();
            kw.sleep();
            kw.selectGrid(MDCMAPPING.headerGrid).count().then(function (count) {
                expect(count).toBe(1);
                console.log('save and search button are working');
                var count1 = count - 1;
                kw.selectGridRowWithFreeRowIndex(count1);
                kw.clickDelete();
                kw.clickSave();
            });
        });

    });

});
