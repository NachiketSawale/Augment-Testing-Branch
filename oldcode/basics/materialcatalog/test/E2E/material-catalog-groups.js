/**
 * Created by hni on 2015/6/02.
 */
(function () {
'use strict';

var MAPPING = require('framework').mapping;
var LOCATOR = require('framework').locator;
var API = require('framework').api;
var MDCMAPPING = require('./material-catalog-mapping');
var MDCCDATA = require('./material-catalog-data');


describe(' test material catalog  Material Group grid container', function () {

	var kw;

	beforeEach(function () {
		kw = API.createNewAPI();
		kw.avoidException();
	});

	afterEach(function () {
		kw = null;
	});

	it('test active Material Group container', function () {
		kw.openAdministrationModule('Material Catalog');
		kw.clickSearchWithInputValue(MDCCDATA.CONTAINER_SEARCH);
		kw.clickGoToNext();
		kw.selectContainer(1, 'Material Groups');
		console.log('open Material Group container successfully');
	});
	it('test Material Group container load data', function () {
		kw.selectGrid(MDCMAPPING.GroupGrid);
		kw.selectGrid(MDCMAPPING.GroupGrid).count().then(function (count) {
			expect(count).not.toBe(0);
			console.log('Material Group container is active, and  show records successfully');
		});
	});
	it('test add and delete button are working ', function () {
		kw.selectGrid(MDCMAPPING.GroupGrid);
		kw.selectGrid(MDCMAPPING.GroupGrid).count().then(function (beforeAdd) {
			kw.clickAdd();
			kw.selectGrid(MDCMAPPING.GroupGrid).count().then(function (afteradd) {
				expect(afteradd).toBe(beforeAdd + 1);
				console.log('add button works');
			});
		});
		kw.selectGrid(MDCMAPPING.GroupGrid).count().then(function (beforedelete) {
			kw.clickDelete();
			kw.selectGrid(MDCMAPPING.GroupGrid).count().then(function (afterdelete) {
				expect(afterdelete).toBe(beforedelete - 1);
				console.log('delete button works');
			});
		});
	});
	it('test save function is working', function () {
		kw.selectGrid(MDCMAPPING.GroupGrid);
		kw.clickAdd();
		kw.selectGrid(MDCMAPPING.GroupGrid).count().then(function (afteradd) {
			afteradd--;
			kw.selectGridRow(afteradd);
			kw.modifyCellValueByColumnName('Code', MDCCDATA.MATERIAL_GROUP.TEST_SAVE_SEARCH_CASE.CODE);
			kw.modifyCellValueByColumnName('Description', MDCCDATA.MATERIAL_GROUP.TEST_SAVE_SEARCH_CASE.DESCRIPTION);
			kw.modifyDialogCellByColumnName('Structure Code',  MDCCDATA.MATERIAL_GROUP.TEST_SAVE_SEARCH_CASE.STRUCTURE_CODE);
			kw.shiftAwayCursor('Code');
			kw.clickSave();
			kw.clickSearchWithInputValue(MDCCDATA.CONTAINER_SEARCH);
			kw.clickGoToNext();
			kw.sleep();
			kw.selectGrid(MDCMAPPING.GroupGrid).count().then(function (afterSave) {
				expect(afterSave).toBe(afteradd + 1);
				console.log('save function is working');
				var count=afterSave-1;
				kw.selectGridRowWithFreeRowIndex(count);
				kw.clickDelete();
				kw.clickSave();
			});
		});
	});
	//it('Add a new root record of Material Groups grid', function () {
	//    kw.selectGrid(MDCMAPPING.GroupGrid);
	//    kw.clickAdd();
	//    kw.selectGrid(MDCMAPPING.GroupGrid).count().then(function (afterAddCountWithoutSave) {
	//        afterAddCountWithoutSave--;
	//        kw.selectGridRow(afterAddCountWithoutSave);
	//        kw.modifyCellValueByColumnName('Code', MDCCDATA.MATERIAL_GROUP.ADD_ROOT.CODE);
	//        kw.modifyCellValueByColumnName('Description', MDCCDATA.MATERIAL_GROUP.ADD_ROOT.DESCRIPTION);
	//        kw.modifyLookupCellByColumnName('Structure Code', 'dropDownBox', MDCCDATA.MATERIAL_GROUP.ADD_ROOT.STRUCTURE_CODE);
	//        kw.pressKey(protractor.Key.TAB);
	//        kw.clickSave();
	//        //keyboard.clickRefresh();
	//        //keyboard.clickSearchWithInputValue(MDCCDATA.MATERIAL_GROUP.SEARCH);
	//        kw.selectGrid(MDCMAPPING.GroupGrid).count().then(function (afterSaveAndRefreshCount) {
	//            expect(afterSaveAndRefreshCount).toBe(afterAddCountWithoutSave + 1);
	//        });
	//    });
	//});


	//it('Add a new sub record of Material Groups grid', function () {
	//    keyboard.selectGrid(MDCMAPPING.GroupGrid);
	//    keyboard.selectGrid(MDCMAPPING.GroupGrid).count().then(function (selectLastRecord) {
	//        selectLastRecord--;
	//        keyboard.selectGridRow(selectLastRecord);
	//        keyboard.clickSubAdd();
	//    });
	//    keyboard.selectGrid(MDCMAPPING.GroupGrid).count().then(function (afterAddCountWithoutSave) {
	//        afterAddCountWithoutSave--;
	//        keyboard.selectGridRow(afterAddCountWithoutSave);
	//        keyboard.modifyCellValueByColumnName('Code', MDCCDATA.MATERIAL_GROUP.ADD_SUB.CODE);
	//        keyboard.modifyCellValueByColumnName('Description', MDCCDATA.MATERIAL_GROUP.ADD_SUB.DESCRIPTION);
	//        keyboard.modifyLookupCellByColumnName('Structure Code', 'dropDownBox', MDCCDATA.MATERIAL_GROUP.ADD_SUB.STRUCTURE_CODE);
	//        keyboard.pressKey(protractor.Key.TAB);
	//        keyboard.clickSave();
	//        keyboard.clickRefresh();
	//        keyboard.clickSearchWithInputValue(MDCCDATA.MATERIAL_GROUP.SEARCH);
	//        keyboard.selectGrid(MDCMAPPING.GroupGrid).count().then(function (selectNewAddRecord) {
	//            selectNewAddRecord--;
	//            keyboard.selectGridRow(selectNewAddRecord);
	//            keyboard.clickExpandAll();
	//        });
	//        keyboard.selectGrid(MDCMAPPING.GroupGrid).count().then(function (afterSaveAndRefreshCount) {
	//            expect(afterSaveAndRefreshCount).toBe(afterAddCountWithoutSave+1 );
	//        });
	//    });
	//});

	//it('delete a record of Material Groups  grid', function () {
	//    kw.selectGrid(MDCMAPPING.GroupGrid);
	//    kw.selectGridRowByAssignCode(MDCCDATA.MATERIAL_GROUP.ADD_ROOT.CODE);
	//    kw.selectGrid(MDCMAPPING.GroupGrid).count().then(function (beforeDeleteCount) {
	//        beforeDeleteCount--;
	//       kw.clickDelete();
	//        kw.clickSave();
	//        // keyboard.clickRefresh();
	//        //keyboard.clickSearchWithInputValue(MDCCDATA.MATERIAL_GROUP.SEARCH);
	//        kw.selectGrid(MDCMAPPING.GroupGrid).count().then(function (afterDeleteCount) {
	//            expect(afterDeleteCount).toBe(beforeDeleteCount);
	//        });
	//    });
	//});

	//it('modify cell values on  Material Groups grid', function () {
	//    keyboard.clickSearchWithInputValue(MDCCDATA.MATERIAL_GROUP.SEARCH);
	//    keyboard.selectGrid(MDCMAPPING.GroupGrid);
	//    keyboard.selectGridRow(0);
	//    keyboard.modifyCellValueByColumnName('Code', MDCCDATA.MATERIAL_GROUP.MODIFY.CODE);
	//    keyboard.modifyCellValueByColumnName('Description', MDCCDATA.MATERIAL_GROUP.MODIFY.DESCRIPTION);
	//    keyboard.modifyLookupCellByColumnName('Structure Code', 'dropDownBox', MDCCDATA.MATERIAL_GROUP.MODIFY.STRUCTURE_CODE);
	//    keyboard.pressKey(protractor.Key.TAB);
	//    keyboard.clickSave();
	//
	//    keyboard.getCellTextByColumnName('Code').then(function (value) {
	//        expect(value).toBe(MDCCDATA.MATERIAL_GROUP.MODIFY.CODE);
	//    });
	//    keyboard.getCellTextByColumnName('Description').then(function (value) {
	//        expect(value).toBe(MDCCDATA.MATERIAL_GROUP.MODIFY.DESCRIPTION);
	//    });
	//    keyboard.getCellTextByColumnName('Structure Code').then(function (value) {
	//        expect(value).toBe(MDCCDATA.MATERIAL_GROUP.MODIFY.STRUCTURE_CODE);
	//    });
	//});

	//it('test whether the cell is read only  on  material group grid', function () {
	//    kw.selectGrid(MDCMAPPING.GroupGrid);
	//    kw.selectGridRow(0);
	//    kw.checkCellReadOnlyByColumnName('Structure description');
	//});
	//it('test whether The CODE field has to be validated to be unique', function () {
	//    kw.selectGrid(MDCMAPPING.GroupGrid);
	//    kw.selectGridRow(0);
	//    kw.modifyCellValueByColumnName('Code', 'AUTOTEST02');
	//    kw.pressKey(protractor.Key.TAB);
	//    kw.getWarning('Code');
	//});
});
})();