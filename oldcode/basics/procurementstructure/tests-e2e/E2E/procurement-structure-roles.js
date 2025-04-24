/**
 * Created by hni on 2015/6/2.
 */
'use strict';

var MAPPING = require('framework').mapping;
var LOCATOR = require('framework').locator;
var API = require('framework').api;
var PRCMAPPING = require('./procurement-structure-mapping');
var PRCDATA = require('./procurement-structure-data');

describe(' test procurement structure Roles grid container', function () {

  var kw;

  beforeEach(function () {
    kw = API.createNewAPI();
	kw.avoidException();
  });

  afterEach(function () {
    kw = null;
  });

    it('test active role container', function () {
        kw.openAdministrationModule('Procurement Structure');
        kw.clickSearchWithInputValue(PRCDATA.CONTAINER_SEARCH);
        kw.clickGoToNext();
        kw.selectContainer(1, 'Roles');
        console.log('open role container successfully');
    });
    it('test role container load data', function () {
        kw.selectGrid(PRCMAPPING.clerkGrid);
        kw.selectGrid(PRCMAPPING.clerkGrid).count().then(function (count) {
            expect(count).not.toEqual(0);
            console.log('role container is active, and  show records successfully')
        });
    });
    it('test add and delete button are working ', function () {
        kw.selectGrid(PRCMAPPING.clerkGrid);
        kw.selectGrid(PRCMAPPING.clerkGrid).count().then(function (beforeAdd) {
            kw.clickAdd();
            kw.selectGrid(PRCMAPPING.clerkGrid).count().then(function (afteradd) {
                expect(afteradd).toBe(beforeAdd + 1);
                console.log('add button works');
            });
        });
        kw.selectGrid(PRCMAPPING.clerkGrid).count().then(function (beforedelete) {
            kw.clickDelete();
            kw.selectGrid(PRCMAPPING.clerkGrid).count().then(function (afterdelete) {
                expect(afterdelete).toBe(beforedelete - 1);
                console.log('delete button works');
            });
        });
    });
    it('test save function is working', function () {
        kw.selectGrid(PRCMAPPING.clerkGrid);
        kw.clickAdd();
        kw.selectGrid(PRCMAPPING.clerkGrid).count().then(function (afteradd) {
            afteradd--;
            kw.selectGridRow(afteradd);
            kw.modifyDropDownLookupByColumnName('Company',PRCDATA.PRC_ROLES.TEST_SAVE_AND_SEARCH.COMPANY);
            kw.modifyComboLookupCellByColumnName('Clerk Role', PRCDATA.PRC_ROLES.TEST_SAVE_AND_SEARCH.CLERK_ROLE);
            kw.modifyDialogCellByColumnName('Clerk', PRCDATA.PRC_ROLES.TEST_SAVE_AND_SEARCH.CLERK);
            kw.modifyCellValueByColumnName('Comment', PRCDATA.PRC_ROLES.TEST_SAVE_AND_SEARCH.COMMENT);
            kw.shiftAwayCursor('Company');
            kw.clickSave();
            kw.clickSearchWithInputValue(PRCDATA.CONTAINER_SEARCH);
            kw.clickGoToNext();
            kw.sleep();
            kw.selectGrid(PRCMAPPING.clerkGrid).count().then(function (afterSave) {
                expect(afterSave).toBe(afteradd + 1);
                console.log('save function is working');
                var count=afterSave-1;
                kw.selectGridRowWithFreeRowIndex(count);
                kw.clickDelete();
                kw.clickSave();
            });
        })
    });

  //it('Add a new record of Roles grid', function () {
  //  kw.selectGrid(PRCMAPPING.clerkGrid);
  //  kw.clickAdd();
  //  kw.selectGrid(PRCMAPPING.clerkGrid).count().then(function (afterAddCount) {
  //    afterAddCount--;
  //    kw.selectGridRow(afterAddCount);
  //    kw.modifyLookupCellByColumnName('Company', 'dropDownBox', PRCDATA.PRC_ROLES.ADD.COMPANY)
  //    kw.modifyLookupCellByColumnName('Clerk role', 'comboBox', PRCDATA.PRC_ROLES.ADD.CLERK_ROLE);
  //    kw.modifyDialogCellByColumnName('Clerk', PRCDATA.PRC_ROLES.ADD.CLERK);
  //    kw.modifyCellValueByColumnName('Comment', PRCDATA.PRC_ROLES.ADD.COMMENT);
  //    kw.pressKey(protractor.Key.TAB);
  //    kw.clickSave();
  //    kw.clickRefresh();
  //    kw.clickSearchWithInputValue(PRCDATA.PRC_ROLES.SEARCH);
  //    kw.selectGrid(PRCMAPPING.clerkGrid).count().then(function (afterSaveAndRefreshCount) {
  //      expect(afterSaveAndRefreshCount).toBe(afterAddCount + 1);
  //    });
  //  });
  //});
  //
  //it('delete a record of Roles grid', function () {
  //  kw.clickSearchWithInputValue(PRCDATA.PRC_ROLES.SEARCH);
  //  kw.selectGrid(PRCMAPPING.clerkGrid);
  //  kw.selectGrid(PRCMAPPING.clerkGrid).count().then(function (beforeDeleteCount) {
  //    for (beforeDeleteCount; beforeDeleteCount > 1; beforeDeleteCount--) {
  //      kw.clickDelete();
  //    }
  //    kw.clickSave();
  //    kw.clickRefresh();
  //    kw.clickSearchWithInputValue(PRCDATA.PRC_ROLES.SEARCH);
  //    kw.selectGrid(PRCMAPPING.clerkGrid).count().then(function (afterDeleteCount) {
  //      expect(afterDeleteCount).toBe(beforeDeleteCount);
  //    });
  //  });
  //});
  //
  //it('modify cell values on  Roles grid', function () {
  //  kw.clickSearchWithInputValue(PRCDATA.PRC_ROLES.SEARCH);
  //  kw.selectGrid(PRCMAPPING.clerkGrid);
  //  kw.selectGridRow(0);
  //  kw.modifyLookupCellByColumnName('Company', 'dropDownBox', PRCDATA.PRC_ROLES.MODIFY.COMPANY)
  //  kw.modifyLookupCellByColumnName('Clerk role', 'comboBox', PRCDATA.PRC_ROLES.MODIFY.CLERK_ROLE);
  //  kw.modifyDialogCellByColumnName('Clerk', PRCDATA.PRC_ROLES.MODIFY.CLERK);
  //  kw.modifyCellValueByColumnName('Comment', PRCDATA.PRC_ROLES.MODIFY.COMMENT);
  //  kw.pressKey(protractor.Key.TAB);
  //  kw.clickSave();
  //  kw.clickSearchWithInputValue(PRCDATA.PRC_ROLES.SEARCH);
  //  kw.getCellTextByColumnName('Company').then(function (value) {
  //    expect(value).toBe(PRCDATA.PRC_ROLES.MODIFY.COMPANY);
  //  });
  //  kw.getCellTextByColumnName('Clerk role').then(function (value) {
  //    expect(value).toBe(PRCDATA.PRC_ROLES.MODIFY.CLERK_ROLE);
  //  });
  //  kw.getCellTextByColumnName('Clerk').then(function (value) {
  //    expect(value).toBe(PRCDATA.PRC_ROLES.MODIFY.CLERK);
  //  });
  //  kw.getCellTextByColumnName('Comment').then(function (value) {
  //    expect(value).toBe(PRCDATA.PRC_ROLES.MODIFY.COMMENT);
  //  });
  //});
  //
  //it('test whether the cell is read only  on  Roles grid', function () {
  //  kw.selectGrid(PRCMAPPING.clerkGrid);
  //  kw.selectGridRow(0);
  //  kw.checkCellReadOnlyByColumnName('Company Name');
  //  kw.checkCellReadOnlyByColumnName('Clerk Name');
  //});
});