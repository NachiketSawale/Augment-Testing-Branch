/**
 * Created by hni on 2015/6/01.
 */

'use strict';

var MAPPING = require('framework').mapping;
var LOCATOR = require('framework').locator;
var API = require('framework').api;
var PRCMAPPING = require('./procurement-structure-mapping');
var PRCDATA = require('./procurement-structure-data');

describe('procurement structure header container test', function () {

    var kw;

    beforeEach(function () {
        kw = API.createNewAPI();
        kw.avoidException();
    });

    afterEach(function () {
        kw = null;
    });

    it('test  open procurement structure  module', function () {
        kw.openAdministrationModule('Procurement Structure');
        console.log('open Procurement Structure module successfully');
        kw.maxContainerLayout(0, 'Procurement Structures');
    });
    it('test the header container works,click the refresh and it will load data', function () {
        kw.selectGrid(PRCMAPPING.HeaderGridContainer);
        kw.clickRefresh();
        kw.selectGrid(PRCMAPPING.HeaderGridContainer).count().then(function (count) {
            expect(count).not.toEqual(0);
            console.log('procurement structure load data successfully')
        });
    });
    it('test  add root and delete button are working ', function () {
        kw.selectGrid(PRCMAPPING.HeaderGridContainer);
        kw.clickDiscard();
        kw.selectGrid(PRCMAPPING.HeaderGridContainer).count().then(function (beforeAdd) {
            kw.clickAdd();
            kw.selectGrid(PRCMAPPING.HeaderGridContainer).count().then(function (afteradd) {
                expect(afteradd).toBe(beforeAdd + 1);
                console.log('add root record button works');
            });
        });
        kw.selectGrid(PRCMAPPING.HeaderGridContainer).count().then(function (beforedelete) {
            kw.clickDelete();
            kw.selectGrid(PRCMAPPING.HeaderGridContainer).count().then(function (afterdelete) {
                expect(afterdelete).toBe(beforedelete - 1);
                console.log('delete button works');
            });
        });
    });
    it('test  add sub  and delete button are working ', function () {
        kw.selectGrid(PRCMAPPING.HeaderGridContainer);
        kw.clickSearchWithInputValue(PRCDATA.CONTAINER_SEARCH);
        kw.clickGoToNext();
        kw.selectGrid(PRCMAPPING.HeaderGridContainer).count().then(function (beforeAdd) {
            kw.clickSubAdd();
            kw.selectGrid(PRCMAPPING.HeaderGridContainer).count().then(function (afteradd) {
                expect(afteradd).toBe(beforeAdd + 1);
                console.log('add sub record button works');
            });
        });
        kw.selectGrid(PRCMAPPING.HeaderGridContainer).count().then(function (beforedelete) {
            kw.clickDelete();
            kw.selectGrid(PRCMAPPING.HeaderGridContainer).count().then(function (afterdelete) {
                expect(afterdelete).toBe(beforedelete - 1);
                console.log('delete button works');
            });
        });
    });
    it('test  save and search are working', function () {
        kw.clickDiscard();
        kw.selectGrid(PRCMAPPING.HeaderGridContainer);
        kw.clickAdd();
        kw.selectGrid(PRCMAPPING.HeaderGridContainer).count().then(function (afteradd) {
            afteradd--;
            kw.selectGridRow(afteradd);
            kw.modifyCellValueByColumnName('Code', PRCDATA.PRC_HEADER.TEST_SAVE_SEARCH_CASE.CODE);
            kw.modifyCellValueByColumnName('Description', PRCDATA.PRC_HEADER.TEST_SAVE_SEARCH_CASE.DESCRIPTION);
            kw.modifyDialogCellByColumnName('Cost Code',PRCDATA.PRC_HEADER.TEST_SAVE_SEARCH_CASE.COST_CODE);
            kw.modifyDialogCellByColumnName('Cost Code URP 1',PRCDATA.PRC_HEADER.TEST_SAVE_SEARCH_CASE.COST_CODE);
            kw.modifyDialogCellByColumnName('Cost Code URP 2',PRCDATA.PRC_HEADER.TEST_SAVE_SEARCH_CASE.COST_CODE);
            kw.modifyDialogCellByColumnName('Cost Code URP 3',PRCDATA.PRC_HEADER.TEST_SAVE_SEARCH_CASE.COST_CODE);
            kw.modifyDialogCellByColumnName('Cost Code URP 4',PRCDATA.PRC_HEADER.TEST_SAVE_SEARCH_CASE.COST_CODE);
            kw.modifyDialogCellByColumnName('Cost Code URP 5',PRCDATA.PRC_HEADER.TEST_SAVE_SEARCH_CASE.COST_CODE);
            kw.modifyDialogCellByColumnName('Cost Code URP 6',PRCDATA.PRC_HEADER.TEST_SAVE_SEARCH_CASE.COST_CODE);
            kw.modifyDropDownLookupByColumnName('Tax Code',PRCDATA.PRC_HEADER.TEST_SAVE_SEARCH_CASE.TAX_CODE);
            kw.clickCheckBoxByColumnName('IsFormalHandover');
            kw.clickCheckBoxByColumnName('IsApprovalRequired');
            kw.clickCheckBoxByColumnName('IsStockExcluded');
            kw.shiftAwayCursor('Tax Code Description');
            kw.clickSave();
            kw.clickSearchWithInputValue(PRCDATA.PRC_HEADER.TEST_SAVE_SEARCH_CASE.CODE);
            kw.clickGoToNext();
            kw.selectGrid(PRCMAPPING.HeaderGridContainer).count().then(function (count) {
                expect(count).toBe(1);
                console.log('save and search button are working');
                var count1=count-1;
                kw.selectGridRowWithFreeRowIndex(count1);
                kw.clickDelete();
                kw.clickSave();
            });
        });

    });
    //
    //
    //
    //it('procurement structure @@ check Cell Read Only', function () {
    //    kw.clickSearchWithInputValue(PRCDATA.CONTAINER_SEARCH);
    //    kw.selectGrid(PRCMAPPING.HeaderGridContainer).count().then(function (count) {
    //        kw.selectGridRow(0);
    //        kw.checkCheckBoxReadOnlyByColumnName('Active');
    //       kw.checkCheckBoxReadOnlyByColumnName('Allow Assignment');
    //    });
    //});


    //it('test  the code should be unique', function () {
    //    kw.selectGrid(PRCMAPPING.HeaderGridContainer);
    //    kw.clickDiscard();
    //    kw.clickAdd();
    //    kw.modifyCellValueByColumnName('Code', 'AUTOTEST02');
    //    kw.pressKey(protractor.Key.TAB);
    //    kw.getWarning('Code');
    //});
    //it('test  the type of sub records inherited from the parent', function () {
    //    kw.clickSearchWithInputValue('AUTOTEST03');
    //    kw.selectGrid(PRCMAPPING.HeaderGridContainer);
    //    kw.selectGridRowWithFreeRowIndex(0);
    //    kw.clickSubAdd();
    //    browser.sleep(6000);
    //    kw.selectGridRowWithFreeRowIndex(0);
    //    var parentTypeValue = kw.getCellTextByColumnName('Type');
    //    parentTypeValue.then(function (parentTypeValue1) {
    //        console.log('parent record type is: ' + parentTypeValue1);
    //    });
    //    kw.selectGridRowWithFreeRowIndex(1);
    //    var childTypeValue = kw.getCellTextByColumnName('Type');
    //    childTypeValue.then(function (childTypeValue1) {
    //        console.log('child record type is: ' + childTypeValue1);
    //    });
    //    expect(childTypeValue).toBe(parentTypeValue);
    //});
    //it('test  the Allow Assignment default is true', function () {
    //    kw.clickAdd();
    //    browser.sleep(200);
    //    kw.selectGrid(PRCMAPPING.HeaderGridContainer).count().then(function (count) {
    //        count--;
    //        kw.checkCheckBoxWhetherIsMark(count, 'Allow Assignment')
    //    });
    //});
    //it('test  the tax code defaults to the default tax code of the login company',function(){
    //    kw.selectGrid(PRCMAPPING.HeaderGridContainer);
    //    kw.clickAdd();
    //    kw.selectGrid(PRCMAPPING.HeaderGridContainer).count().then(function(count){
    //        count--;
    //        kw.selectGridRow(count);
    //  var taxCodeValue = kw.getCellTextByColumnName('Tax Code');
    //        taxCodeValue.then(function (taxCodeValue1) {
    //            console.log('tax code default value is: '+taxCodeValue1);
    //            expect(taxCodeValue1).toBe('1');
    //        });
    //
    //
    //    })

    //})
	it('clear database ', function(){
        kw.updateTestDatabaseTestData('delete from prc_structure where whoisr=173');
    });

});
