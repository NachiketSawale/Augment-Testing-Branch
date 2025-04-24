/**
 * Created by hni on 2015/11/3.
 */

'use strict';

var MAPPING = require('framework').mapping;
var LOCATOR = require('framework').locator;
var API = require('framework').api;
var PRCMAPPING = require('./procurement-structure-mapping');
var PRCDATA = require('./procurement-structure-data');


describe(' test procurement structure Event grid container', function () {

    var kw;

    beforeEach(function () {
        kw = API.createNewAPI();
		kw.avoidException();
    });

    afterEach(function () {
        kw = null;
    });

    it('test active Event container', function () {
        kw.openAdministrationModule('Procurement Structure');
        kw.clickSearchWithInputValue(PRCDATA.CONTAINER_SEARCH);
        kw.clickGoToNext();
        kw.selectContainer(1, 'Event');
        console.log('open Event container successfully');
    });
    it('test Event container load data', function () {
        kw.selectGrid(PRCMAPPING.eventGrid);
        kw.selectGrid(PRCMAPPING.eventGrid).count().then(function (count) {
            expect(count).not.toEqual(0);
            console.log('Event container is active, and  show records successfully')
        });
    });
    it('test add and delete button are working ', function () {
        kw.selectGrid(PRCMAPPING.eventGrid);
        kw.selectGrid(PRCMAPPING.eventGrid).count().then(function (beforeAdd) {
            kw.clickAdd();
            kw.selectGrid(PRCMAPPING.eventGrid).count().then(function (afteradd) {
                expect(afteradd).toBe(beforeAdd + 1);
                console.log('add button works');
            });
        });
        kw.selectGrid(PRCMAPPING.eventGrid).count().then(function (beforedelete) {
            kw.clickDelete();
            kw.selectGrid(PRCMAPPING.eventGrid).count().then(function (afterdelete) {
                expect(afterdelete).toBe(beforedelete - 1);
                console.log('delete button works');
            });
        });
    });
    it('test save function is working', function () {
        kw.selectGrid(PRCMAPPING.eventGrid);
        kw.clickAdd();
        kw.selectGrid(PRCMAPPING.eventGrid).count().then(function (afteradd) {
            afteradd--;
            kw.selectGridRow(afteradd);
            kw.modifyComboLookupCellByColumnName('Event Type', PRCDATA.PRC_EVENT.TEST_SAVE_AND_SEARCH.EVENT_TYPE);
            kw.modifyCellValueByColumnName('Start No. Of Days', PRCDATA.PRC_EVENT.TEST_SAVE_AND_SEARCH.START_DAY);
            kw.modifyComboLookupCellByColumnName('Start Basis', PRCDATA.PRC_EVENT.TEST_SAVE_AND_SEARCH.START_BASIS);
            kw.modifyComboLookupCellByColumnName('System Event Type Start',PRCDATA.PRC_EVENT.TEST_SAVE_AND_SEARCH.SYSTEM_EVENT_TYPE_START);
            kw.modifyCellValueByColumnName('End No. Of Days', PRCDATA.PRC_EVENT.TEST_SAVE_AND_SEARCH.END_DAY);
            kw.modifyComboLookupCellByColumnName('End Basis',PRCDATA.PRC_EVENT.TEST_SAVE_AND_SEARCH.END_BASIS);
            kw.shiftAwayCursor('Event Type');
            kw.clickSave();
            kw.clickSearchWithInputValue(PRCDATA.CONTAINER_SEARCH);
            kw.clickGoToNext();
            kw.sleep();
            kw.selectGrid(PRCMAPPING.eventGrid).count().then(function (afterSave) {
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
