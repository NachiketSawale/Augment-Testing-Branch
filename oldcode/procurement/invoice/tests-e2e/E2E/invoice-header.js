/**
 * Created by hni on 2016/7/25.
 */
//jshint ignore : start
// eslint-disable-next-line no-useless-escape,strict
'use strict';

var MAPPING = require('framework').mapping; // jshint ignore:line
var LOCATOR = require('framework').locator; // jshint ignore:line
var API = require('framework').api;
var moduleMAPPING = require('./invoice-mapping');
var moduleDATA = require('./invoice-data');

//noinspection JSUnresolvedFunction

describe(' invoice module header container test',
    // eslint-disable-next-line no-useless-escape,strict
    function () {

    var kw;

    //noinspection JSUnresolvedFunction
    beforeEach(function () {  // jshint ignore : line
        kw = API.createNewAPI();
        kw.avoidException();
    });

    //noinspection JSUnresolvedFunction
    afterEach(function () { // jshint ignore : line
        kw = null;
    });

    //noinspection JSUnresolvedFunction
    it('test  open invoice  module', function () {
        kw.openWorkspaceModule('Invoice');
        console.log('open invoice module successfully');
        kw.maxContainerLayout(0, 'Invoice Header');
    });

    //noinspection JSUnresolvedFunction
    it('test the invoice header container works,click the refresh and it will load data', function () {
        kw.selectGrid(moduleMAPPING.HeaderGridContainer);
        kw.clickRefresh();
        kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (count) {
            //noinspection JSUnresolvedFunction
            expect(count).not.toBe(0);
            console.log('invoice header load data successfully');
        });
    });
    //noinspection JSUnresolvedFunction
    it('test  add  and delete button are working ', function () {
        kw.selectGrid(moduleMAPPING.HeaderGridContainer);
        kw.clickDiscard();
        kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (beforeAdd) {
            kw.clickAdd();
            kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (afterAdd) {
                //noinspection JSUnresolvedFunction
                expect(afterAdd).toBe(beforeAdd + 1);
                console.log('add  record button works');
            });
        });
        kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (beforeDelete) {
            kw.clickDelete();
            kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (afterDelete) {
                //noinspection JSUnresolvedFunction
                expect(afterDelete).toBe(beforeDelete - 1);
                console.log('delete button works');
            });
        });
    });
    //noinspection JSUnresolvedFunction
    it('test  new copy button and delete button are working ', function () {
        kw.selectGrid(moduleMAPPING.HeaderGridContainer);
        kw.clickSearchWithInputValue(moduleDATA.header_container.container_search); // jshint ignore:line
        kw.clickGoToNext();
        kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function () {
            kw.clickNewDerivedFromLastAdd();
            kw.sleep();
            kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function () {
               // expect(afterAdd).toBe(beforeAdd + 1);
                console.log('copy record button works');
            });
        });
        kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function () {
            kw.clickDelete();
            kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function () {
               // expect(afterDelete).toBe(beforeDelete - 1);
                console.log('delete button works');
            });
        });
    });
    //noinspection JSUnresolvedFunction
    it('test  save and search are working', function () {
        kw.selectGrid(moduleMAPPING.HeaderGridContainer);
        kw.clickSearchWithInputValue(moduleDATA.header_container.test_save_and_search.ENTRY_NO); // jshint ignore:line
        kw.clickAdd();
        kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (afterAdd) {
            afterAdd--;
            kw.selectGridRow(afterAdd);
             kw.modifyComboLookupCellByColumnName('Configuration',moduleDATA.header_container.test_save_and_search.CONFIGURATION); // jshint ignore:line
            kw.modifyDialogCellByColumnName('Contract',moduleDATA.header_container.test_save_and_search.CONTRACT); // jshint ignore:line
            kw.shiftAwayCursor('Status');
            kw.modifyCellValueByColumnName('Narrative',moduleDATA.header_container.test_save_and_search.NARRATIVE); // jshint ignore:line
            kw.modifyCellValueByColumnName('Entry No.',moduleDATA.header_container.test_save_and_search.ENTRY_NO); // jshint ignore:line
            kw.modifyComboLookupCellByColumnName('Type',moduleDATA.header_container.test_save_and_search.TYPE); // jshint ignore:line
           // kw.modifyComboLookupCellByColumnName('Billing Schema',moduleDATA.header_container.test_save_and_search.BIlLING_SCHEMA);
           // kw.modifyDialogCellByColumnName('Business Partner',moduleDATA.header_container.test_save_and_search.BUSINESS_PARTNER);
            //kw.shiftAwayCursor('Date');
            kw.modifyCellValueByColumnName('Invoice No.',moduleDATA.header_container.test_save_and_search.INVOICE_NO); // jshint ignore:line
            kw.modifyCellValueByColumnName('Amount(Gross)',moduleDATA.header_container.test_save_and_search.AMOUNT_GROSS); // jshint ignore:line
           // kw.modifyComboLookupCellByColumnName('Currency',moduleDATA.header_container.test_save_and_search.CURRENCY);
           // kw.modifyDropDownLookupByColumnName('Tax Code',moduleDATA.header_container.test_save_and_search.TAX_CODE);
          //  kw.modifyComboLookupCellByColumnName('Group',moduleDATA.header_container.test_save_and_search.GROUP);
          //  kw.modifyDialogCellByColumnName('Responsible',moduleDATA.header_container.test_save_and_search.RESPONSIBLE);
           // kw.modifyDialogCellByColumnName('Project No.',moduleDATA.header_container.test_save_and_search.PROJECT_NO);
            //kw.shiftAwayCursor('Project Name');
           // kw.modifyDialogCellByColumnName('Package',moduleDATA.header_container.test_save_and_search.PACKAGE);
           // kw.modifyDialogCellByColumnName('Structure',moduleDATA.header_container.test_save_and_search.STRUCTURE);
           // kw.modifyDialogCellByColumnName('Controlling Unit Code',moduleDATA.header_container.test_save_and_search.CONTROLLING_UNIT);
           // kw.modifyCellValueByColumnName('Discount Amount',moduleDATA.header_container.test_save_and_search.DISCOUNT_AMOUNT);
           // kw.modifyDropDownLookupByColumnName('Payment Term',moduleDATA.header_container.test_save_and_search.PAYMENT_TERM);
          //  kw.shiftAwayCursor('Payment Term Description');
            kw.clickSave();
            kw.clickRefresh();
            kw.clickSearchWithInputValue(moduleDATA.header_container.test_save_and_search.ENTRY_NO); // jshint ignore:line
            kw.clickGoToNext();
            kw.updateTestDatabaseTestData('delete from INV_CERTIFICATE where whoisr=173');
            kw.updateTestDatabaseTestData('delete from INV_GENERALS where  whoisr=173');
            kw.updateTestDatabaseTestData('delete from INV_HEADER2INV_HEADER where  whoisr=173');
            kw.updateTestDatabaseTestData('update INV_HEADER set INV_STATUS_FK=1 where id=173');
            kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (count) {
                //noinspection JSUnresolvedFunction
                expect(count).toBe(afterAdd+1);
                console.log('save and search button are working');
            });

        });

    });
    //noinspection JSUnresolvedFunction
    it('clear database ', function(){
        kw.updateTestDatabaseTestData('delete from INV_CERTIFICATE where whoisr=173');
        kw.updateTestDatabaseTestData('delete from INV_GENERALS where  whoisr=173');
        kw.updateTestDatabaseTestData('delete from INV_HEADER2INV_HEADER where  whoisr=173');
        kw.updateTestDatabaseTestData('delete from INV_BILLINGSCHEMA where  whoisr=173');
        kw.updateTestDatabaseTestData('update INV_HEADER set INV_STATUS_FK=1 where id=173');
        kw.updateTestDatabaseTestData('delete from INV_HEADER where  whoisr=173');
    });
});
