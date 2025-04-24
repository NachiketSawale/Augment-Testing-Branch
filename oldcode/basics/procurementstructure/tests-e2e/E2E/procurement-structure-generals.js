/**
 * Created by hni on 2015/6/02.
 */
'use strict';

var MAPPING = require('framework').mapping;
var LOCATOR = require('framework').locator;
var API = require('framework').api;
var PRCMAPPING = require('./procurement-structure-mapping');
var PRCDATA = require('./procurement-structure-data');


describe(' test procurement structure Generals grid container', function () {

  var kw;

  beforeEach(function () {
    kw = API.createNewAPI();
	kw.avoidException();
  });

  afterEach(function () {
    kw = null;
  });

    it('test active general container', function () {
        kw.openAdministrationModule('Procurement Structure');
        kw.clickSearchWithInputValue(PRCDATA.CONTAINER_SEARCH);
        kw.clickGoToNext();
        kw.selectContainer(1, 'Generals');
        console.log('open general container successfully');
    });
    it('test general container load data', function () {
        kw.selectGrid(PRCMAPPING.GeneralsGrid);
        kw.selectGrid(PRCMAPPING.GeneralsGrid).count().then(function (count) {
            expect(count).not.toEqual(0);
            console.log('general container is active, and  show records successfully')
        });
    });
    it('test add and delete button are working ', function () {
        kw.selectGrid(PRCMAPPING.GeneralsGrid);
        kw.selectGrid(PRCMAPPING.GeneralsGrid).count().then(function (beforeAdd) {
            kw.clickAdd();
            kw.selectGrid(PRCMAPPING.GeneralsGrid).count().then(function (afteradd) {
                expect(afteradd).toBe(beforeAdd + 1);
                console.log('add button works');
            });
        });
        kw.selectGrid(PRCMAPPING.GeneralsGrid).count().then(function (beforedelete) {
            kw.clickDelete();
            kw.selectGrid(PRCMAPPING.GeneralsGrid).count().then(function (afterdelete) {
                expect(afterdelete).toBe(beforedelete - 1);
                console.log('delete button works');
            });
        });
    });
    it('test save function is working', function () {
        kw.selectGrid(PRCMAPPING.GeneralsGrid);
        kw.clickAdd();
        kw.selectGrid(PRCMAPPING.GeneralsGrid).count().then(function (afteradd) {
            afteradd--;
            kw.selectGridRow(afteradd);
            kw.modifyComboLookupCellByColumnName('Configuration', PRCDATA.PRC_GENERALS.TEST_SAVE_AND_SEARCH.CONFIGURATION);
            kw.modifyComboLookupCellByColumnName('Type',PRCDATA.PRC_GENERALS.TEST_SAVE_AND_SEARCH.TYPE);
            kw.modifyCellValueByColumnName('Value', PRCDATA.PRC_GENERALS.TEST_SAVE_AND_SEARCH.VALUE);
            kw.modifyCellValueByColumnName('Comment', PRCDATA.PRC_GENERALS.TEST_SAVE_AND_SEARCH.COMMENT);
            kw.shiftAwayCursor('Type');
            kw.clickSave();
            kw.clickSearchWithInputValue(PRCDATA.CONTAINER_SEARCH);
            kw.clickGoToNext();
            browser.sleep(2000);
            kw.selectGrid(PRCMAPPING.GeneralsGrid).count().then(function (afterSave) {
                expect(afterSave).toBe(afteradd + 1);
                console.log('save function is working');
                kw.selectGridRow( 1);
                browser.sleep(2000);
                kw.clickDelete();
                kw.clickSave();
            });
        })
    });
	
	it('clear database ', function(){
        kw.updateTestDatabaseTestData('delete from PRC_CONFIG2GENERALS where whoisr=173');
    });
});