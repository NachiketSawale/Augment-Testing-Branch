/**
 * Created by hni on 2015/7/27.
 */
(function () {
'use strict';

//var MAPPING = require('framework').mapping;
//var LOCATOR = require('framework').locator;
var API = require('framework').api;
var MDCMAPPING = require('./material-catalog-mapping');
var MDCCDATA = require('./material-catalog-data');


describe(' test material catalog: material attributes grid container', function () {

	var kw;
	var afterAddCountWithoutSaveAndRefresh;
	var afterDeleteCountWithoutSaveAndRefresh;

	beforeEach(function () {
		kw = API.createNewAPI();
		kw.avoidException();
	});

	afterEach(function () {
		kw = null;
	});

	it('test active attribute container', function () {
		kw.openAdministrationModule('Material Catalog');
		kw.clickSearchWithInputValue(MDCCDATA.CONTAINER_SEARCH);
		kw.clickGoToNext();
		kw.selectContainer(1, 'Material Groups');
		kw.selectGrid(MDCMAPPING.GroupGrid);
		kw.selectGridRowWithFreeRowIndex(0);
		kw.selectContainer(2, 'Attributes');
		console.log('open attribute container successfully');
	});
	it('test attribute container load data', function () {
		kw.selectGrid(MDCMAPPING.GroupCharGrid);
		kw.selectGrid(MDCMAPPING.GroupCharGrid).count().then(function (count) {
			expect(count).not.toBe(0);
			console.log('attribute container is active, and  show records successfully');
		});
	});
	it('test add and delete button are working ', function () {
		kw.selectGrid(MDCMAPPING.GroupCharGrid);
		kw.selectGrid(MDCMAPPING.GroupCharGrid).count().then(function (beforeAdd) {
			kw.clickAdd();
			kw.selectGrid(MDCMAPPING.GroupCharGrid).count().then(function (afteradd) {
				expect(afteradd).toBe(beforeAdd + 1);
				console.log('add button works');
			});
		});
		kw.selectGrid(MDCMAPPING.GroupCharGrid).count().then(function (beforedelete) {
			kw.clickDelete();
			kw.selectGrid(MDCMAPPING.GroupCharGrid).count().then(function (afterdelete) {
				expect(afterdelete).toBe(beforedelete - 1);
				console.log('delete button works');
			});
		});
	});
	it('test save function is working', function () {
		kw.selectGrid(MDCMAPPING.GroupCharGrid);
		kw.clickAdd();
		kw.selectGrid(MDCMAPPING.GroupCharGrid).count().then(function (afteradd) {
			afteradd--;
			kw.selectGridRow(afteradd);
			kw.modifyCellValueByColumnName('Attribute', MDCCDATA.ATTRIBUTES.TEST_SAVE_SEARCH_CASE.ATTRIBUTE);
			kw.clickCheckBoxByColumnName('Fixed Values');
			kw.shiftAwayCursor('Attribute');
			kw.clickSave();
			kw.selectGrid(MDCMAPPING.GroupCharGrid).count().then(function (afterSave) {
				expect(afterSave).toBe(afteradd + 1);
				console.log('save function is working');

			});
			kw.selectGridRowWithFreeRowIndex(afteradd + 1);
			kw.clickDelete();
			kw.clickSave();
		});
	});

	//it('Add a new root record of Material Attributes grid', function () {
	//    keyboard.selectGrid(MDCMAPPING.GroupCharGrid);
	//    keyboard.clickAdd();
	//    keyboard.selectGrid(MDCMAPPING.GroupCharGrid).count().then(function (afterAddCountWithoutSave) {
	//        afterAddCountWithoutSave--;
	//        keyboard.selectGridRow(afterAddCountWithoutSave);
	//        keyboard.modifyCellValueByColumnName('Attribute', MDCCDATA.ATTRIBUTES.ADD_RECORD.ATTRIBUTE);
	//       keyboard.clickCheckBoxByColumnName('Fixed Values');
	//       keyboard.pressKey(protractor.Key.TAB);
	//        afterAddCountWithoutSaveAndRefresh=afterAddCountWithoutSave+1;
	//      keyboard.clickSave();
	//       keyboard.clickRefresh();
	//       keyboard.clickSearchWithInputValue(MDCCDATA.ATTRIBUTES.SEARCH);
	//        keyboard.shiftTab(1);
	//      // keyboard.selectGrid(MDCMAPPING.GroupGrid);
	//      //keyboard.selectGridRow(0);
	//       //keyboard.shiftTab(2);
	//       //keyboard.selectGrid(MDCMAPPING.GroupCharGrid).count().then(function (afterSaveAndRefreshCount) {
	//       //     expect(afterSaveAndRefreshCount).toBe(afterAddCountWithoutSave + 1);
	//       //});
	//    });
	//});
	//it('make sure whether add and save a new t record of Material Attributes grid are successful', function () {
	//    keyboard.selectGrid(MDCMAPPING.GroupGrid);
	//    keyboard.selectGridRow(0);
	//    keyboard.shiftTab(2);
	//    keyboard.selectGrid(MDCMAPPING.GroupCharGrid).count().then(function (afterSaveAndRefreshCount) {
	//         expect(afterSaveAndRefreshCount).toBe(afterAddCountWithoutSaveAndRefresh + 1);
	//    });
	//});

	//it('delete a record of Material Attributess  grid', function () {
	//    keyboard.selectGrid(MDCMAPPING.GroupCharGrid);
	//    keyboard.selectGrid(MDCMAPPING.GroupCharGrid).count().then(function (beforeDeleteCount) {
	//        for (beforeDeleteCount; beforeDeleteCount > 1; beforeDeleteCount--) {
	//            keyboard.selectGridRow(beforeDeleteCount);
	//            keyboard.clickDelete();
	//        }
	//       // keyboard.clickSave();
	//        keyboard.clickRefresh();
	//        keyboard.clickSearchWithInputValue(MDCCDATA.ATTRIBUTES.SEARCH);
	//        keyboard.shiftTab(1);
	//    //    keyboard.selectGrid(MDCMAPPING.GroupGrid);
	//    //    keyboard.selectGridRow(0);
	//    //    keyboard.shiftTab(2);
	//    //    keyboard.selectGrid(MDCMAPPING.GroupCharGrid).count().then(function (afterDeleteCount) {
	//    //        expect(afterDeleteCount).toBe(beforeDeleteCount);
	//    //    });
	//    });
	//});
	//
	//it('modify cell values on  Material Attributes grid', function () {
	//    keyboard.selectGrid(MDCMAPPING.GroupCharGrid);
	//    keyboard.selectGridRow(0);
	//    keyboard.modifyCellValueByColumnName('Attribute', MDCCDATA.ATTRIBUTES.MODIFY.ATTRIBUTE);
	//    keyboard.clickCheckBoxByColumnName('Fixed Values');
	//    keyboard.pressKey(protractor.Key.TAB);
	//    keyboard.clickSave();
	//    keyboard.getCellTextByColumnName('Attribute').then(function (value) {
	//        expect(value).toBe(MDCCDATA.ATTRIBUTES.MODIFY.ATTRIBUTE);
	//    });
	//});

});
})();