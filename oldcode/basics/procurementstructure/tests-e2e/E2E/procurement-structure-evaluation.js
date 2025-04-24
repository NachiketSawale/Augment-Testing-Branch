/**
 * Created by hni on 2015/6/02.
 */
'use strict';

var MAPPING = require('framework').mapping;
var LOCATOR = require('framework').locator;
var API = require('framework').api;
var PRCMAPPING = require('./procurement-structure-mapping');
var PRCDATA = require('./procurement-structure-data');


describe(' test procurement structure Evaluation grid container', function () {

  var kw;

  beforeEach(function () {
    kw = API.createNewAPI();
	kw.avoidException();
  });

  afterEach(function () {
    kw = null;
  });

    it('test active evaluation container', function () {
        kw.openAdministrationModule('Procurement Structure');
        kw.clickSearchWithInputValue(PRCDATA.CONTAINER_SEARCH);
        kw.clickGoToNext();
        kw.selectContainer(1, 'Evaluation');
        console.log('open evaluation container successfully');
    });
    it('test evaluation container load data', function () {
        kw.selectGrid(PRCMAPPING.evaluationGrid);
        kw.selectGrid(PRCMAPPING.evaluationGrid).count().then(function (count) {
            expect(count).not.toEqual(0);
            console.log('evaluation container is active, and  show records successfully')
        });
    });
    it('test add and delete button are working ', function () {
        kw.selectGrid(PRCMAPPING.evaluationGrid);
        kw.selectGrid(PRCMAPPING.evaluationGrid).count().then(function (beforeAdd) {
            kw.clickAdd();
            kw.selectGrid(PRCMAPPING.evaluationGrid).count().then(function (afteradd) {
                expect(afteradd).toBe(beforeAdd + 1);
                console.log('add button works');
            });
        });
        kw.selectGrid(PRCMAPPING.evaluationGrid).count().then(function (beforedelete) {
            kw.clickDelete();
            kw.selectGrid(PRCMAPPING.evaluationGrid).count().then(function (afterdelete) {
                expect(afterdelete).toBe(beforedelete - 1);
                console.log('delete button works');
            });
        });
    });
    it('test save function is working', function () {
        kw.selectGrid(PRCMAPPING.evaluationGrid);
        kw.clickAdd();
        kw.selectGrid(PRCMAPPING.evaluationGrid).count().then(function (afteradd) {
            afteradd--;
            kw.selectGridRow(afteradd);
            kw.modifyDropDownLookupByColumnName('Company', PRCDATA.PRC_EVALUATION.TEST_SAVE_AND_SEARCH.COMPANY);
            kw.modifyComboLookupCellByColumnName('Evaluation Schema',PRCDATA.PRC_EVALUATION.TEST_SAVE_AND_SEARCH.EVALUATION_SCHEMA);
            kw.shiftAwayCursor('Company');
            kw.clickSave();
            kw.clickSearchWithInputValue(PRCDATA.CONTAINER_SEARCH);
            kw.clickGoToNext();
            kw.sleep();
            kw.selectGrid(PRCMAPPING.evaluationGrid).count().then(function (afterSave) {
                expect(afterSave).toBe(afteradd + 1);
                console.log('save function is working');
                var count=afterSave-1;
                kw.selectGridRowWithFreeRowIndex(count);
                kw.clickDelete();
                kw.clickSave();
            });
        })
    });

  //it('Add a new record of Evaluation grid', function () {
  //  kw.selectGrid(PRCMAPPING.evaluationGrid);
  //  kw.clickAdd();
  //  kw.selectGrid(PRCMAPPING.evaluationGrid).count().then(function (afterAddCount) {
  //    afterAddCount--;
  //    kw.selectGridRow(afterAddCount);
  //    kw.modifyLookupCellByColumnName('Company', 'dropDownBox', PRCDATA.PRC_EVALUATION.ADD.COMPANY);
  //    kw.modifyLookupCellByColumnName('Evaluation Schema', 'comboBox',
  //      PRCDATA.PRC_EVALUATION.ADD.EVALUATION_SCHEMA);
  //    kw.pressKey(protractor.Key.TAB);
  //    kw.clickSave();
  //    kw.clickRefresh();
  //    kw.clickSearchWithInputValue(PRCDATA.PRC_EVALUATION.SEARCH);
  //    kw.selectGrid(PRCMAPPING.evaluationGrid).count().then(function (afterSaveAndRefreshCount) {
  //      expect(afterSaveAndRefreshCount).toBe(afterAddCount + 1);
  //    });
  //  });
  //});
  //
  //it('delete a record of Evaluation grid', function () {
  //  kw.clickSearchWithInputValue(PRCDATA.PRC_EVALUATION.SEARCH);
  //  kw.selectGrid(PRCMAPPING.evaluationGrid);
  //  kw.selectGrid(PRCMAPPING.evaluationGrid).count().then(function (beforeDeleteCount) {
  //    for (beforeDeleteCount; beforeDeleteCount > 1; beforeDeleteCount--) {
  //      kw.clickDelete();
  //    }
  //    kw.clickSave();
  //    kw.clickRefresh();
  //    kw.clickSearchWithInputValue(PRCDATA.PRC_EVALUATION.SEARCH);
  //    kw.selectGrid(PRCMAPPING.evaluationGrid).count().then(function (afterDeleteCount) {
  //      expect(afterDeleteCount).toBe(beforeDeleteCount);
  //    });
  //  });
  //});
  //
  //it('modify cell values on  Evaluation grid', function () {
  //  kw.clickSearchWithInputValue(PRCDATA.PRC_EVALUATION.SEARCH);
  //  kw.selectGrid(PRCMAPPING.evaluationGrid);
  //  kw.selectGridRow(0);
  //  kw.modifyLookupCellByColumnName('Company', 'dropDownBox', PRCDATA.PRC_EVALUATION.MODIFY.COMPANY);
  //  kw.modifyLookupCellByColumnName('Evaluation Schema', 'comboBox',
  //    PRCDATA.PRC_EVALUATION.MODIFY.EVALUATION_SCHEMA);
  //  kw.pressKey(protractor.Key.TAB);
  //  kw.clickSave();
  //  kw.clickSearchWithInputValue(PRCDATA.PRC_EVALUATION.SEARCH);
  //  kw.getCellTextByColumnName('Company').then(function (value) {
  //    expect(value).toBe(PRCDATA.PRC_EVALUATION.MODIFY.COMPANY);
  //  });
  //  kw.getCellTextByColumnName('Evaluation Schema').then(function (value) {
  //    expect(value).toBe(PRCDATA.PRC_EVALUATION.MODIFY.EVALUATION_SCHEMA);
  //  });
  //});
  //
  //it('test whether the cell is read only  on  Evaluation grid', function () {
  //  kw.selectGrid(PRCMAPPING.evaluationGrid);
  //  kw.selectGridRow(0);
  //  kw.checkCellReadOnlyByColumnName('Company Name');
  //});
});
