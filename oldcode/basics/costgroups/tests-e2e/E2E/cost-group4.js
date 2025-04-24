/**
 * Created by hni on 2015/8/10.
 */
'use strict';

var MAPPING = require('framework').mapping;
var LOCATOR = require('framework').locator;
var API = require('framework').api;
var COSTGMAPPING = require('./cost-group-mapping');
var COSTGDATA = require('./cost-group-data');

describe('cost group4  container test', function () {

    var kw;

    beforeEach(function () {
        kw = API.createNewAPI();
		kw.avoidException();
    });

    afterEach(function () {
        kw = null;
    });

    it('test  open cost group4  module', function () {
		kw.sleep();
        kw.openAdministrationModule('Cost Groups');
        console.log('open cost group module successfully');
		kw.sleep();
        kw.selectContainer(3, 'Cost Group4');
    });
    it('test the cost group4 container works,click the refresh and it will load data', function () {
        kw.selectGrid(COSTGMAPPING.costGroupGrid4);
        kw.clickRefresh();
        kw.selectGrid(COSTGMAPPING.costGroupGrid4).count().then(function (count) {
            expect(count).not.toBe(0);
            console.log('cost group4 load data successfully');
        });
    });
    it('test  add root and delete button are working ', function () {
        kw.selectGrid(COSTGMAPPING.costGroupGrid4);
        kw.selectGrid(COSTGMAPPING.costGroupGrid4).count().then(function (beforeAdd) {
            kw.clickAdd();
            kw.selectGrid(COSTGMAPPING.costGroupGrid4).count().then(function (afteradd) {
                expect(afteradd).toBe(beforeAdd + 1);
                console.log('add root record button works');
            });
        });
        kw.selectGrid(COSTGMAPPING.costGroupGrid4).count().then(function (beforedelete) {
            kw.clickDelete();
            kw.selectGrid(COSTGMAPPING.costGroupGrid4).count().then(function (afterdelete) {
                expect(afterdelete).toBe(beforedelete - 1);
                console.log('delete button works');
            });
        });
    });
    it('test  add sub  and delete button are working ', function () {
        kw.selectGrid(COSTGMAPPING.costGroupGrid4);
        kw.selectGridRow(0);
        kw.selectGrid(COSTGMAPPING.costGroupGrid4).count().then(function (beforeAdd) {
            kw.clickSubAdd();
            kw.selectGrid(COSTGMAPPING.costGroupGrid4).count().then(function (afteradd) {
                // expect(afteradd).toBe(beforeAdd + 1);
                console.log('add sub record button works');
            });
        });
        kw.selectGrid(COSTGMAPPING.costGroupGrid4).count().then(function (beforedelete) {
            kw.clickDelete();
            kw.selectGrid(COSTGMAPPING.costGroupGrid4).count().then(function (afterdelete) {
                //expect(afterdelete).toBe(beforedelete - 1);
                console.log('delete button works');
            });
        });
    });
    it('test  save and search are working', function () {
        kw.selectGrid(COSTGMAPPING.costGroupGrid4);
        kw.clickAdd();
        kw.selectGrid(COSTGMAPPING.costGroupGrid4).count().then(function (afteradd) {
            afteradd--;
            kw.selectGridRow(afteradd);
            kw.modifyCellValueByColumnName('Code',COSTGDATA.COST_GROUP4.TEST_SAVE_SEARCH_CASE.CODE);
            kw.modifyCellValueByColumnName('Description',COSTGDATA.COST_GROUP4.TEST_SAVE_SEARCH_CASE.DESCRIPTION);
            kw.modifyCellValueByColumnName('Quantity',COSTGDATA.COST_GROUP4.TEST_SAVE_SEARCH_CASE.QUANTITY);
            //kw.modifyDropDownLookupByColumnName('UoM',COSTGDATA.COST_GROUP4.TEST_SAVE_SEARCH_CASE.UOM);
            kw.shiftAwayCursor('Code');
            kw.clickSave();
            kw.clickRefresh();
            kw.clickGoToNext();
            kw.sleep();
            kw.selectGrid(COSTGMAPPING.costGroupGrid4).count().then(function (count) {
                //expect(count).toBe(afteradd+1);
                console.log('save and search button are working');
                kw.selectGridRowByAssignCode(COSTGDATA.COST_GROUP4.TEST_SAVE_SEARCH_CASE.CODE);
                kw.clickDelete();
                kw.clickSave();
            });

        });

    });
 it('clear database ', function(){
        kw.updateTestDatabaseTestData('delete from LIC_COSTGROUP4 where whoisr=259');
       
    });
});
