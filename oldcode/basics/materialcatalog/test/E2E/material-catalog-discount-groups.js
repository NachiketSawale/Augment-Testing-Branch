/**
 * Created by hni on 2015/6/02.
 */
(function () {
'use strict';

//var MAPPING = require('framework').mapping;
//var LOCATOR = require('framework').locator;
var API = require('framework').api;
var MDCMAPPING = require('./material-catalog-mapping');
var MDCCDATA = require('./material-catalog-data');


describe(' test material catalog: Material Discount Group grid container', function () {

	var kw;

	beforeEach(function () {
		kw = API.createNewAPI();
		kw.avoidException();
	});

	afterEach(function () {
		kw = null;
	});

	it('test active material discount group container', function () {
		kw.openAdministrationModule('Material Catalog');
		kw.clickSearchWithInputValue(MDCCDATA.CONTAINER_SEARCH);
		kw.clickGoToNext();
		kw.selectContainer(1, 'Discount Groups');
		console.log('open material discount group container successfully');
	});
	it('test material discount group container load data', function () {
		kw.selectGrid(MDCMAPPING.DiscountGroupGrid);
		kw.selectGrid(MDCMAPPING.DiscountGroupGrid).count().then(function (count) {
			expect(count).not.toBe(0);
			console.log('material discount group container is active, and  show records successfully');
		});
	});
	it('test add and delete button are working ', function () {
		kw.selectGrid(MDCMAPPING.DiscountGroupGrid);
		kw.selectGrid(MDCMAPPING.DiscountGroupGrid).count().then(function (beforeAdd) {
			kw.clickAdd();
			kw.selectGrid(MDCMAPPING.DiscountGroupGrid).count().then(function (afteradd) {
				expect(afteradd).toBe(beforeAdd + 1);
				console.log('add button works');
			});
		});
		kw.selectGrid(MDCMAPPING.DiscountGroupGrid).count().then(function (beforedelete) {
			kw.clickDelete();
			kw.selectGrid(MDCMAPPING.DiscountGroupGrid).count().then(function (afterdelete) {
				expect(afterdelete).toBe(beforedelete - 1);
				console.log('delete button works');
			});
		});
	});
	it('test save function is working', function () {
		kw.selectGrid(MDCMAPPING.DiscountGroupGrid);
		kw.clickAdd();
		kw.selectGrid(MDCMAPPING.DiscountGroupGrid).count().then(function (afteradd) {
			afteradd--;
			kw.selectGridRow(afteradd);
			kw.modifyCellValueByColumnName('Code', MDCCDATA.MATERIAL_DISCOUNT_GROUP.TEST_SAVE_SEARCH_CASE.CODE);
			kw.modifyCellValueByColumnName('Description', MDCCDATA.MATERIAL_DISCOUNT_GROUP.TEST_SAVE_SEARCH_CASE.DESCRIPTION);
			kw.modifyComboLookupCellByColumnName('Discount Type', MDCCDATA.MATERIAL_DISCOUNT_GROUP.TEST_SAVE_SEARCH_CASE.DISCOUNT_TYPE);
			kw.modifyCellValueByColumnName('Discount', MDCCDATA.MATERIAL_DISCOUNT_GROUP.TEST_SAVE_SEARCH_CASE.DISCOUNT);
			kw.shiftAwayCursor('Code');
			kw.clickSave();
			kw.clickSearchWithInputValue(MDCCDATA.CONTAINER_SEARCH);
			kw.clickGoToNext();
			kw.sleep();
			kw.selectGrid(MDCMAPPING.DiscountGroupGrid).count().then(function (afterSave) {
				expect(afterSave).toBe(afteradd + 1);
				console.log('save function is working');
				var count = afterSave - 1;
				kw.selectGridRowWithFreeRowIndex(count);
				kw.clickDelete();
				kw.clickSave();
			});
		});
	});
});
})();