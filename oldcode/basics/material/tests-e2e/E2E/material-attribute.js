/**
 * Created by hni on 2015/8/13.
 */



'use strict';
var MAPPING = require('framework').mapping;
var LOCATOR = require('framework').locator;
var API = require('framework').api;
var MDCMAPPING = require('./material-mapping');
var MDCDATA = require('./material-data');

describe('Material Attributes container test', function () {
    var kw;
    beforeEach(function () {
        kw = API.createNewAPI();
    });

    afterEach(function () {
        kw = null;
    });

    it('test active Attributes container', function () {
        kw.openWorkspaceModule('Material');
        kw.clickSearchWithInputValue(MDCDATA.CONTAINER_SEARCH);
        kw.clickGoToNext();
        kw.selectContainer(1, 'Attributes');
        console.log('open Attributes container successfully');
    });
    it('test Attributes container load data', function () {
        kw.selectGrid(MDCMAPPING.characteristicGrid);
        kw.selectGrid(MDCMAPPING.characteristicGrid).count().then(function (count) {
            expect(count).not.toBe(0);
            console.log('Attributes container is active, and  show records successfully');
        });
    });
    it('test add and delete button are working ', function () {
        kw.selectGrid(MDCMAPPING.characteristicGrid);
        kw.selectGrid(MDCMAPPING.characteristicGrid).count().then(function (beforeAdd) {
            kw.clickAdd();
            kw.selectGrid(MDCMAPPING.characteristicGrid).count().then(function (afteradd) {
                expect(afteradd).toBe(beforeAdd + 1);
                console.log('add button works');
            });
        });
        kw.selectGrid(MDCMAPPING.characteristicGrid).count().then(function (beforedelete) {
            kw.clickDelete();
            kw.selectGrid(MDCMAPPING.characteristicGrid).count().then(function (afterdelete) {
                expect(afterdelete).toBe(beforedelete - 1);
                console.log('delete button works');
            });
        });
    });
    it('test save function is working', function () {
        kw.selectGrid(MDCMAPPING.characteristicGrid);
        kw.clickAdd();
        kw.selectGrid(MDCMAPPING.characteristicGrid).count().then(function (afteradd) {
            afteradd--;
            kw.selectGridRow(afteradd);
            kw.modifyCellValueByColumnName('Property', MDCDATA.ATTRIBUTE.TEST_SAVE_SEARCH_CASE.PROPERTY);
            kw.modifyCellValueByColumnName('Characteristic', MDCDATA.ATTRIBUTE.TEST_SAVE_SEARCH_CASE.CHARACTERISTIC);
            kw.shiftAwayCursor('Property');
            kw.clickSave();
            kw.clickSearchWithInputValue(MDCDATA.CONTAINER_SEARCH);
            kw.clickGoToNext();
            kw.sleep();
            kw.selectGrid(MDCMAPPING.characteristicGrid).count().then(function (afterSave) {
                expect(afterSave).toBe(afteradd + 1);
                console.log('save function is working');
                kw.selectGridRowByAssignCode(MDCDATA.ATTRIBUTE.TEST_SAVE_SEARCH_CASE.PROPERTY);
                kw.clickDelete();
                kw.sleep();
                kw.clickSave();
            });
        });
    });

});

