/**
 * Created by hni on 2015/6/02.
 */

'use strict';

var MAPPING = require('framework').mapping;
var LOCATOR = require('framework').locator;
var API = require('framework').api;
var PRCMAPPING = require('./procurement-structure-mapping');
var PRCDATA = require('./procurement-structure-data');


describe(' test procurement structure Account grid container', function () {

  var kw;

  beforeEach(function () {
    kw = API.createNewAPI();
	kw.avoidException();
  });

  afterEach(function () {
    kw = null;
  });


    it('test active account container', function () {
        kw.openAdministrationModule('Procurement Structure');
        kw.clickSearchWithInputValue(PRCDATA.CONTAINER_SEARCH);
        kw.clickGoToNext();
        kw.selectContainer(1, 'Accounts');
        console.log('open account container successfully');
    });
    it('test account container load data', function () {
        kw.selectGrid(PRCMAPPING.AccountGrid);
        kw.selectGrid(PRCMAPPING.AccountGrid).count().then(function (count) {
            expect(count).not.toEqual(0);
            console.log('account container is active, and  show records successfully')
        });
    });
    it('test add and delete button are working ', function () {
        kw.selectGrid(PRCMAPPING.AccountGrid);
        kw.selectGrid(PRCMAPPING.AccountGrid).count().then(function (beforeAdd) {
            kw.clickAdd();
            kw.selectGrid(PRCMAPPING.AccountGrid).count().then(function (afteradd) {
                expect(afteradd).toBe(beforeAdd + 1);
                console.log('add button works');
            });
        });
        kw.selectGrid(PRCMAPPING.AccountGrid).count().then(function (beforedelete) {
            kw.clickDelete();
            kw.selectGrid(PRCMAPPING.AccountGrid).count().then(function (afterdelete) {
                expect(afterdelete).toBe(beforedelete - 1);
                console.log('delete button works');
            });
        });
    });
    it('test save function is working', function () {
        kw.selectGrid(PRCMAPPING.AccountGrid);
        kw.clickAdd();
        kw.selectGrid(PRCMAPPING.AccountGrid).count().then(function (afteradd) {
            afteradd--;
            kw.selectGridRow(afteradd);
            kw.modifyComboLookupCellByColumnName('Type', PRCDATA.PRC_ACCOUNTS.TEST_SAVE_AND_SEARCH.TYPE);
            kw.modifyDropDownLookupByColumnName('Tax code', PRCDATA.PRC_ACCOUNTS.TEST_SAVE_AND_SEARCH.TAX_CODE);
            kw.modifyCellValueByColumnName('Account', PRCDATA.PRC_ACCOUNTS.TEST_SAVE_AND_SEARCH.ACCOUNT);
            kw.modifyCellValueByColumnName('Offset Account', PRCDATA.PRC_ACCOUNTS.TEST_SAVE_AND_SEARCH.OFFSET_ACCOUNT);
            kw.shiftAwayCursor('Account');
            kw.clickSave();
            kw.clickSearchWithInputValue(PRCDATA.CONTAINER_SEARCH);
            kw.clickGoToNext();
            kw.sleep();
            kw.selectGrid(PRCMAPPING.AccountGrid).count().then(function (afterSave) {
                expect(afterSave).toBe(afteradd + 1);
                console.log('save function is working');
                var count=afterSave-1;
                kw.selectGridRowWithFreeRowIndex(count);
                kw.clickDelete();
                kw.clickSave();
            });
        })
    });

});