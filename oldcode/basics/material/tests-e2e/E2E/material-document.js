/**
 * Created by hni on 2015/8/13.
 */



'use strict';
var MAPPING = require('framework').mapping;
var LOCATOR = require('framework').locator;
var API = require('framework').api;
var MDCMAPPING = require('./material-mapping');
var MDCDATA = require('./material-data');

describe('Material document container test', function () {
    var kw;
    beforeEach(function () {
        kw = API.createNewAPI();

    });

    afterEach(function () {
        kw = null;
    });

    it('test active document container', function () {
        kw.openWorkspaceModule('Material');
        kw.clickSearchWithInputValue(MDCDATA.CONTAINER_SEARCH);
        kw.clickGoToNext();
        kw.selectContainer(1, 'Documents');
        console.log('open document container successfully');
    });
    it('test document container load data', function () {
        kw.selectGrid(MDCMAPPING.documentGrid);
        kw.selectGrid(MDCMAPPING.documentGrid).count().then(function (count) {
            expect(count).not.toBe(0);
            console.log('document container is active, and  show records successfully');
        });
    });
    it('test add and delete button are working ', function () {
        kw.selectGrid(MDCMAPPING.documentGrid);
        kw.selectGrid(MDCMAPPING.documentGrid).count().then(function (beforeAdd) {
            kw.clickAdd();
            kw.selectGrid(MDCMAPPING.documentGrid).count().then(function (afteradd) {
                expect(afteradd).toBe(beforeAdd + 1);
                console.log('add button works');
            });
        });
        kw.selectGrid(MDCMAPPING.documentGrid).count().then(function (beforedelete) {
            kw.clickDelete();
            kw.selectGrid(MDCMAPPING.documentGrid).count().then(function (afterdelete) {
                expect(afterdelete).toBe(beforedelete - 1);
                console.log('delete button works');
            });
        });
    });
    it('test save function is working', function () {
        kw.selectGrid(MDCMAPPING.documentGrid);
        kw.clickAdd();
        kw.selectGrid(MDCMAPPING.documentGrid).count().then(function (afteradd) {
            afteradd--;
            kw.selectGridRow(afteradd);
            kw.modifyComboLookupCellByColumnName('Type',MDCDATA.DOCUMENT.TEST_SAVE_SEARCH_CASE.TYPE);
            kw.modifyCellValueByColumnName('Description',MDCDATA.DOCUMENT.TEST_SAVE_SEARCH_CASE.DESCRIPTION);
            kw.pressKey(protractor.Key.TAB);
            kw.clickSave();
            kw.clickSearchWithInputValue(MDCDATA.CONTAINER_SEARCH);
            kw.clickGoToNext();
            kw.sleep();
            kw.selectGrid(MDCMAPPING.documentGrid).count().then(function (afterSave) {
                expect(afterSave).toBe(afteradd + 1);
                console.log('save function is working');
                var count=afterSave-1;
                kw.selectGridRowByAssignCode(MDCDATA.DOCUMENT.TEST_SAVE_SEARCH_CASE.DESCRIPTION);
                kw.clickDelete();
                kw.clickSave();
            });
        });
    });

});

