/**
 * Created by hni on 2015/7/28.
 */
(function () {
'use strict';

//var MAPPING = require('framework').mapping;
//var LOCATOR = require('framework').locator;
var API = require('framework').api;
var MDCMAPPING = require('./material-catalog-mapping');
var MDCCDATA = require('./material-catalog-data');


describe(' test material catalog Material ATTRIBUTES_VALUES grid container', function () {

	var kw;

	beforeEach(function () {
		kw = API.createNewAPI();
		kw.avoidException();
	});

	afterEach(function () {
		kw = null;
	});


	it('test active attribute value container', function () {
		kw.openAdministrationModule('Material Catalog');
		kw.clickSearchWithInputValue(MDCCDATA.CONTAINER_SEARCH);
		kw.clickGoToNext();
		kw.selectLayout(1,'Layout 1');
		kw.chooseContainerForOneLayout(0,'Material Groups');
		kw.chooseContainerForOneLayout(2,'Attributes');
		kw.clickLayoutOk();
		kw.selectGrid(MDCMAPPING.GroupGrid).then(function () {
			kw.selectGridRowWithFreeRowIndex(0);
			kw.selectGrid(MDCMAPPING.GroupCharGrid).then(function () {
				kw.selectGridRowWithFreeRowIndex(0);
				kw.selectContainer(2, 'Attribute Values');
				console.log('open attribute value container successfully');
			});
		});
	});
	it('test attribute value container load data', function () {
		kw.selectGrid(MDCMAPPING.GroupCharValGrid);
		kw.selectGrid(MDCMAPPING.GroupCharValGrid).count().then(function (count) {
			expect(count).not.toBe(0);
			console.log('attribute value container is active, and  show records successfully');
		});
	});
	it('test add and delete button are working ', function () {
		kw.selectGrid(MDCMAPPING.GroupCharValGrid);
		kw.selectGrid(MDCMAPPING.GroupCharValGrid).count().then(function (beforeAdd) {
			kw.clickAdd();
			kw.selectGrid(MDCMAPPING.GroupCharValGrid).count().then(function (afteradd) {
				expect(afteradd).toBe(beforeAdd + 1);
				console.log('add button works');
			});
		});
		kw.selectGrid(MDCMAPPING.GroupCharValGrid).count().then(function (beforedelete) {
			kw.clickDelete();
			kw.selectGrid(MDCMAPPING.GroupCharValGrid).count().then(function (afterdelete) {
				expect(afterdelete).toBe(beforedelete - 1);
				console.log('delete button works');
			});
		});
	});
	it('test save function is working', function () {
		kw.selectGrid(MDCMAPPING.GroupCharValGrid);
		kw.clickAdd();
		kw.selectGrid(MDCMAPPING.GroupCharValGrid).count().then(function (afteradd) {
			afteradd--;
			kw.selectGridRow(afteradd);
			kw.modifyCellValueByColumnName('value', MDCCDATA.ATTRIBUTES_VALUES.TEST_SAVE_SEARCH_CASE.VALUE);
			kw.pressKey(protractor.Key.TAB);
			kw.clickSave();
			kw.selectGrid(MDCMAPPING.GroupCharValGrid).count().then(function (afterSave) {
				expect(afterSave).toBe(afteradd + 1);
				console.log('save function is working');
				kw.selectGridRowWithFreeRowIndex(afteradd + 1);
				kw.clickDelete();
				kw.clickSave();
			});

		});
	});

	//it('Add a new root record of Material ATTRIBUTES_VALUES grid', function () {
	//    kw.selectGrid(MDCMAPPING.GroupCharValGrid);
	//    kw.clickAdd();
	//    kw.selectGrid(MDCMAPPING.GroupCharValGrid).count().then(function (afterAddCountWithoutSave) {
	//        afterAddCountWithoutSave--;
	//        kw.selectGridRow(afterAddCountWithoutSave);
	//        kw.modifyCellValueByColumnName('Value', MDCCDATA.ATTRIBUTES_VALUES_VALUES.ADD_RECORD.VALUE);
	//       kw.pressKey(protractor.Key.TAB);
	//      kw.clickSave();
	//       kw.clickRefresh();
	//       kw.clickSearchWithInputValue(MDCCDATA.ATTRIBUTES_VALUES.SEARCH);
	//        kw.shiftTab(1);
	//      // keyboard.selectGrid(MDCMAPPING.GroupGrid);
	//      //keyboard.selectGridRow(0);
	//       //keyboard.shiftTab(2);
	//       //keyboard.selectGrid(MDCMAPPING.GroupCharValGrid).count().then(function (afterSaveAndRefreshCount) {
	//       //     expect(afterSaveAndRefreshCount).toBe(afterAddCountWithoutSave + 1);
	//       //});
	//    });
	//});
	//it('make sure whether add and save a new t record of Material ATTRIBUTES_VALUES grid are successful', function () {
	//    keyboard.selectGrid(MDCMAPPING.GroupGrid);
	//    keyboard.selectGridRow(0);
	//    keyboard.shiftTab(2);
	//    keyboard.selectGrid(MDCMAPPING.GroupCharValGrid).count().then(function (afterSaveAndRefreshCount) {
	//         expect(afterSaveAndRefreshCount).toBe(afterAddCountWithoutSaveAndRefresh + 1);
	//    });
	//});

	//it('delete a record of Material ATTRIBUTES_VALUESs  grid', function () {
	//    keyboard.selectGrid(MDCMAPPING.GroupCharValGrid);
	//    keyboard.selectGrid(MDCMAPPING.GroupCharValGrid).count().then(function (beforeDeleteCount) {
	//        for (beforeDeleteCount; beforeDeleteCount > 1; beforeDeleteCount--) {
	//            keyboard.selectGridRow(beforeDeleteCount);
	//            keyboard.clickDelete();
	//        }
	//       // keyboard.clickSave();
	//        keyboard.clickRefresh();
	//        keyboard.clickSearchWithInputValue(MDCCDATA.ATTRIBUTES_VALUES.SEARCH);
	//        keyboard.shiftTab(1);
	//    //    keyboard.selectGrid(MDCMAPPING.GroupGrid);
	//    //    keyboard.selectGridRow(0);
	//    //    keyboard.shiftTab(2);
	//    //    keyboard.selectGrid(MDCMAPPING.GroupCharValGrid).count().then(function (afterDeleteCount) {
	//    //        expect(afterDeleteCount).toBe(beforeDeleteCount);
	//    //    });
	//    });
	//});
	//
	//it('modify cell values on  Material ATTRIBUTES_VALUES grid', function () {
	//    keyboard.selectGrid(MDCMAPPING.GroupCharValGrid);
	//    keyboard.selectGridRow(0);
	// keyboard.modifyCellValueByColumnName('Value', MDCCDATA.ATTRIBUTES_VALUES_VALUES.MODIFY.VALUE);
	//    keyboard.pressKey(protractor.Key.TAB);
	//    keyboard.clickSave();
	//    keyboard.getCellTextByColumnName('attribute value').then(function (value) {
	//        expect(value).toBe(MDCCDATA.ATTRIBUTES_VALUES_VALUES.MODIFY.VALUE);
	//    });
	//});

});
})();