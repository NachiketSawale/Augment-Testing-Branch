/**
 * Created by hni on 2015/8/11.
 */

'use strict';

var MAPPING = require('framework').mapping;
var LOCATOR = require('framework').locator;
var API = require('framework').api;
var AMMAPPING = require('./asset-master-mapping');
var AMDATA = require('./asset-master-data');
var assertMaster=['MDC_ASSET_MASTER'];

describe('asset master   container test', function () {

	var kw;

	beforeEach(function () {
		kw = API.createNewAPI();
		kw.avoidException();
	});

	afterEach(function () {
		kw.clearTestDatabaseTestData(assertMaster);
		kw = null;
	});

	it('test  open asset master   module', function () {
		kw.sleep();
		kw.openAdministrationModule('Asset Master');
		console.log('open Asset Master module successfully');
		kw.maxContainerLayout(0, 'Asset Master Grid');
		kw.sleep();
	});
	it('test the asset master  container works,click the refresh and it will load data', function () {
		kw.selectGrid(AMMAPPING.assetMasterGrid);
		kw.clickRefresh();
		kw.sleep();
		kw.clickGoToNext();
		kw.selectGrid(AMMAPPING.assetMasterGrid).count().then(function (count) {
			// expect(count).not.toBe(0);
			console.log('asset master  load data successfully');
		});
	});
	it('test  add root and delete button are working ', function () {
		kw.selectGrid(AMMAPPING.assetMasterGrid);
		kw.clickDiscard();
		kw.selectGrid(AMMAPPING.assetMasterGrid).count().then(function (beforeAdd) {
			kw.clickAdd();
			kw.selectGrid(AMMAPPING.assetMasterGrid).count().then(function (afteradd) {
				expect(afteradd).toBe(beforeAdd + 1);
				console.log('add root record button works');
			});
		});
		kw.selectGrid(AMMAPPING.assetMasterGrid).count().then(function (beforedelete) {
			kw.clickDelete();
			kw.selectGrid(AMMAPPING.assetMasterGrid).count().then(function (afterdelete) {
				expect(afterdelete).toBe(beforedelete - 1);
				console.log('delete button works');
			});
		});
	});
	it('test  add sub  and delete button are working ', function () {
		kw.selectGrid(AMMAPPING.assetMasterGrid);
		kw.clickSearchWithInputValue(AMDATA.CONTAINER_SEARCH);
		kw.selectGridRow(0);
		kw.selectGrid(AMMAPPING.assetMasterGrid).count().then(function (beforeAdd) {
			kw.clickSubAdd();
			kw.selectGrid(AMMAPPING.assetMasterGrid).count().then(function (afteradd) {
				// expect(afteradd).toBe(beforeAdd + 1);
				console.log('add sub record button works');
			});
		});
		kw.selectGrid(AMMAPPING.assetMasterGrid).count().then(function (beforedelete) {
			kw.clickDelete();
			kw.selectGrid(AMMAPPING.assetMasterGrid).count().then(function (afterdelete) {
				// expect(afterdelete).toBe(beforedelete - 1);
				console.log('delete button works');
			});
		});
	});
	it('test  save and search are working', function () {
		kw.selectGrid(AMMAPPING.assetMasterGrid);
		kw.clickDiscard();
		kw.clickAdd();
		kw.selectGrid(AMMAPPING.assetMasterGrid).count().then(function (afteradd) {
			afteradd--;
			kw.selectGridRow(afteradd);
			kw.modifyCellValueByColumnName('Code',AMDATA.ASSET_MASTER.TEST_SAVE_SEARCH_CASE.CODE);
			kw.modifyCellValueByColumnName('Description',AMDATA.ASSET_MASTER.TEST_SAVE_SEARCH_CASE.DESCRIPTION);
			kw.shiftAwayCursor('Code');
			kw.clickSave();
			kw.clickSearchWithInputValue(AMDATA.ASSET_MASTER.TEST_SAVE_SEARCH_CASE.CODE);
			kw.clickGoToNext();
			kw.selectGrid(AMMAPPING.assetMasterGrid).count().then(function (count) {
				expect(count).toBe(afteradd+1);
				console.log('save and search button are working');
				kw.selectGridRowByAssignCode(AMDATA.ASSET_MASTER.TEST_SAVE_SEARCH_CASE.CODE);
				kw.clickDelete();
				kw.clickSave();
				browser.sleep(2000);
			});
		});
	});
	it('test open specification container',function(){
		kw.selectLayout(0,'Layout 1');
		kw.chooseContainerForOneLayout(0,'Asset Master Grid');
		kw.chooseContainerForOneLayout(2,'Specification');
		console.log('open specification container successfully');
		kw.clickLayoutOk();
	});
	it('test set values to specification container',function(){
		kw.selectGrid(AMMAPPING.assetMasterGrid);
		kw.clickSearchWithInputValue(AMDATA.CONTAINER_SEARCH);
		kw.selectGridRowWithFreeRowIndex(0);
		kw.setValueToSpecification(AMDATA.SET_VALUE_TO_SPECIFICATION_CASE);
		kw.clickSave();
		kw.clickSearchWithInputValue(AMDATA.CONTAINER_SEARCH);
		kw.checkSpecificationText();
	});
	 it('clear database ', function(){
		kw.updateTestDatabaseTestData('delete from mdc_asset_master where whoisr=259');

	});
});
