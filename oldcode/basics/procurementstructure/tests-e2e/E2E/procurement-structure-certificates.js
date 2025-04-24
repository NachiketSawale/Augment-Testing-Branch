/**
 * Created by hni on 2015/6/02.
 */

'use strict';

var MAPPING = require('framework').mapping;
var LOCATOR = require('framework').locator;
var API = require('framework').api;
var PRCMAPPING = require('./procurement-structure-mapping');
var PRCDATA = require('./procurement-structure-data');


describe(' procurement structure certificates grid container', function () {

  var kw;

  beforeEach(function () {
    kw = API.createNewAPI();
	kw.avoidException();
  });

  afterEach(function () {
    kw = null;
  });

    it('test active certificate container', function () {
        kw.openAdministrationModule('Procurement Structure');
        kw.clickSearchWithInputValue(PRCDATA.CONTAINER_SEARCH);
        kw.clickGoToNext();
        kw.selectContainer(1, 'Certificates');
        console.log('open certificate container successfully');
    });
    it('test certificate container load data', function () {
        kw.selectGrid(PRCMAPPING.CertGrid);
        kw.selectGrid(PRCMAPPING.CertGrid).count().then(function (count) {
            expect(count).not.toEqual(0);
            console.log('certificate container is active, and  show records successfully')
        });
    });
    it('test add and delete button are working ', function () {
        kw.selectGrid(PRCMAPPING.CertGrid);
        kw.selectGrid(PRCMAPPING.CertGrid).count().then(function (beforeAdd) {
            kw.clickAdd();
            kw.selectGrid(PRCMAPPING.CertGrid).count().then(function (afteradd) {
                expect(afteradd).toBe(beforeAdd + 1);
                console.log('add button works');
            });
        });
        kw.selectGrid(PRCMAPPING.CertGrid).count().then(function (beforedelete) {
            kw.clickDelete();
            kw.selectGrid(PRCMAPPING.CertGrid).count().then(function (afterdelete) {
                expect(afterdelete).toBe(beforedelete - 1);
                console.log('delete button works');
            });
        });
    });
    it('test save function is working', function () {
        kw.selectGrid(PRCMAPPING.CertGrid);
        kw.clickAdd();
        kw.selectGrid(PRCMAPPING.CertGrid).count().then(function (afteradd) {
            afteradd--;
            kw.selectGridRow(afteradd);
            kw.modifyComboLookupCellByColumnName('Configuration', PRCDATA.PRC_CERTIFICATES.TEST_SAVE_AND_SEARCH.CONFIGURATION);
            kw.modifyComboLookupCellByColumnName('Type',PRCDATA.PRC_CERTIFICATES.TEST_SAVE_AND_SEARCH.TYPE);
            kw.modifyCellValueByColumnName('Comment', PRCDATA.PRC_CERTIFICATES.TEST_SAVE_AND_SEARCH.COMMENT);
            kw.clickCheckBoxByColumnName('Is Required');
            kw.clickCheckBoxByColumnName('Is mandatory');
            kw.clickCheckBoxByColumnName('Is Required Sub Sub');
            kw.clickCheckBoxByColumnName('Is mandatory Sub Sub');
            kw.shiftAwayCursor('Type');
            kw.clickSave();
            kw.clickSearchWithInputValue(PRCDATA.CONTAINER_SEARCH);
            kw.clickGoToNext();
            kw.sleep();
            kw.selectGrid(PRCMAPPING.CertGrid).count().then(function (afterSave) {
                expect(afterSave).toBe(afteradd + 1);
                console.log('save function is working');
                var count=afterSave-1;
                kw.selectGridRowWithFreeRowIndex(count);
                kw.clickDelete();
                kw.clickSave();
            });
        })
    });


  //  it('Add a new record of certificates grid', function () {
  //  kw.selectGrid(PRCMAPPING.CertGrid);
  //  kw.clickAdd();
  //  kw.selectGrid(PRCMAPPING.CertGrid).count().then(function (afterAddCount) {
  //    afterAddCount--;
  //    kw.selectGridRow(afterAddCount);
  //    //keyboard.modifyCellValueByIndex(2, PRCDATA.PRC_HEADER.ADD_ROOT.CODE);
  //    kw.modifyLookupCellByColumnName('Configuration', 'comboBox', PRCDATA.PRC_CERTIFICATES.ADD.CONFIGURATION);
  //    kw.modifyLookupCellByColumnName('Type', 'comboBox', PRCDATA.PRC_CERTIFICATES.ADD.TYPE);
  //    kw.clickCheckBoxByColumnName('Is Required');
  //    kw.clickCheckBoxByColumnName('Is mandatory');
  //    kw.clickCheckBoxByColumnName('Is Required Sub-Sub');
  //    kw.clickCheckBoxByColumnName('Is mandatory Sub-Sub');
  //    kw.modifyCellValueByColumnName('Comment', PRCDATA.PRC_CERTIFICATES.ADD.COMMENT);
  //    kw.pressKey(protractor.Key.TAB);
  //    kw.clickSave();
  //    kw.clickRefresh();
  //    kw.clickSearchWithInputValue(PRCDATA.PRC_CERTIFICATES.SEARCH);
  //    kw.selectGrid(PRCMAPPING.CertGrid).count().then(function (afterSaveAndRefreshCount) {
  //      expect(afterSaveAndRefreshCount).toBe(afterAddCount + 1);
  //    });
  //  });
  //});
  //
  //it('delete a record of certificates grid', function () {
  //  kw.clickSearchWithInputValue(PRCDATA.PRC_CERTIFICATES.SEARCH);
  //  kw.selectGrid(PRCMAPPING.CertGrid);
  //  kw.selectGrid(PRCMAPPING.CertGrid).count().then(function (beforeDeleteCount) {
  //    for (beforeDeleteCount; beforeDeleteCount > 1; beforeDeleteCount--) {
  //      kw.clickDelete();
  //    }
  //    kw.clickSave();
  //    kw.clickRefresh();
  //    kw.clickSearchWithInputValue(PRCDATA.PRC_CERTIFICATES.SEARCH);
  //    kw.selectGrid(PRCMAPPING.CertGrid).count().then(function (afterDeleteCount) {
  //      expect(afterDeleteCount).toBe(1);
  //    });
  //  });
  //});
  //
  //it('modify cell values on  certificates grid', function () {
  //  kw.clickSearchWithInputValue(PRCDATA.PRC_CERTIFICATES.SEARCH);
  //  kw.selectGrid(PRCMAPPING.CertGrid);
  //  kw.selectGridRow(0);
  //  kw.modifyLookupCellByColumnName('Configuration', 'comboBox', PRCDATA.PRC_CERTIFICATES.MODIFY.CONFIGURATION);
  //  kw.modifyLookupCellByColumnName('Type', 'comboBox', PRCDATA.PRC_CERTIFICATES.MODIFY.TYPE);
  //  kw.clickCheckBoxByColumnName('Is Required');
  //  kw.clickCheckBoxByColumnName('Is mandatory');
  //  kw.clickCheckBoxByColumnName('Is Required Sub-Sub');
  //  kw.clickCheckBoxByColumnName('Is mandatory Sub-Sub');
  //  kw.modifyCellValueByColumnName('Comment', PRCDATA.PRC_CERTIFICATES.MODIFY.COMMENT);
  //  kw.pressKey(protractor.Key.TAB);
  //  kw.clickSave();
  //  kw.clickSearchWithInputValue(PRCDATA.PRC_CERTIFICATES.SEARCH);
  //  kw.getCellTextByColumnName('Configuration').then(function (value) {
  //    expect(value).toBe(PRCDATA.PRC_CERTIFICATES.MODIFY.CONFIGURATION);
  //  });
  //  kw.getCellTextByColumnName('Type').then(function (value) {
  //    expect(value).toBe(PRCDATA.PRC_CERTIFICATES.MODIFY.TYPE);
  //  });
  //  kw.getCellTextByColumnName('Comment').then(function (value) {
  //    expect(value).toBe(PRCDATA.PRC_CERTIFICATES.MODIFY.COMMENT);
  //  });
  //});
  //
  ////it('test whether the cell is read only  on  certificates grid', function () {
  ////    keyboard.selectGrid(PRCMAPPING.CertGrid);
  ////    keyboard.checkCellReadOnlyByColumnName();
  ////});
  	it('clear database ', function(){
        kw.updateTestDatabaseTestData('delete from PRC_CONFIGURATION2CERT where whoisr=173');
    });
});

