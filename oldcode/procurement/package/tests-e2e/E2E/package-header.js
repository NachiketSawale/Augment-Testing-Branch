/**
 * Created by hni on 2015/8/10.
 */
'use strict';

var MAPPING = require('framework').mapping; // jshint ignore:line
var LOCATOR = require('framework').locator; // jshint ignore:line
var API = require('framework').api;
var moduleMAPPING = require('./package-mapping');
var moduleDATA = require('./package-data');

// noinspection JSUnresolvedFunction
describe(' package module header container test', function () {

	var kw;

	// noinspection JSUnresolvedFunction
	beforeEach(function () { // jshint ignore : line
		kw = API.createNewAPI();
		kw.avoidException();
	});

	// noinspection JSUnresolvedFunction
	afterEach(function () { // jshint ignore : line
		kw = null;
	});

	// noinspection JSUnresolvedFunction
	it('test  open package  module', function () {
		kw.openWorkspaceModule('Package');
		console.log('open Package module successfully');
		kw.maxContainerLayout(0, 'Package');
	});

	// noinspection JSUnresolvedFunction
	it('test the package header container works,click the refresh and it will load data', function () {
		kw.selectGrid(moduleMAPPING.HeaderGridContainer);
		kw.clickRefresh();
		kw.sleep();
		kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (count) {
			// noinspection JSUnresolvedFunction
			expect(count).not.toBe(0);
			console.log('package header load data successfully');
		});
	});
	// noinspection JSUnresolvedFunction
	it('test  add  and delete button are working ', function () {
		kw.selectGrid(moduleMAPPING.HeaderGridContainer);
		kw.clickDiscard();
		kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (beforeAdd) {
			kw.clickAdd();
			kw.setDialogValueByButtonForValidation('Project Name', moduleDATA.header_container.header_add.PROJECTNMAE); // jshint ignore:line
			kw.setComboBoxValueForValidation('Configuration', moduleDATA.header_container.header_add.CONFIGURATION); // jshint ignore:line
			kw.okOrCancelForValidation('OK');
			kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (afterAdd) {
				// noinspection JSUnresolvedFunction
				expect(afterAdd).toBe(beforeAdd + 1);
				console.log('add root record button works');
			});
		});
		kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (beforeDelete) {
			kw.clickDelete();
			kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (afterDelete) {
				// noinspection JSUnresolvedFunction
				expect(afterDelete).toBe(beforeDelete - 1);
				console.log('delete button works');
			});
		});
	});
	// noinspection JSUnresolvedFunction
	it('test  save and search are working', function () {
		kw.updateTestDatabaseTestData('delete from prc_package where code="AUTO_2016"');
		kw.selectGrid(moduleMAPPING.HeaderGridContainer);
		kw.clickSearchWithInputValue(moduleDATA.header_container.test_save_and_search.CODE); // jshint ignore:line
		kw.clickAdd();
		kw.setDialogValueByButtonForValidation('Project Name', moduleDATA.header_container.test_save_and_search.PROJECT_NAME); // jshint ignore:line
		kw.setComboBoxValueForValidation('Configuration', moduleDATA.header_container.test_save_and_search.CONFIGURATION); // jshint ignore:line
		kw.okOrCancelForValidation('OK');
		kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (afterAdd) {
			afterAdd--;
			kw.selectGridRow(afterAdd);
			kw.modifyCellValueByColumnName('Code', moduleDATA.header_container.test_save_and_search.CODE); // jshint ignore:line
			kw.modifyCellValueByColumnName('Description', moduleDATA.header_container.test_save_and_search.DESCRIPTION); // jshint ignore:line
			// kw.modifyDropDownLookupByColumnName('UoM', moduleDATA.header_container.test_save_and_search.UOM);
			kw.modifyComboLookupCellByColumnName('Currency', moduleDATA.header_container.test_save_and_search.CURRENCY); // jshint ignore:line
			kw.modifyDialogCellByColumnName('Structure', 'auto test');
			kw.shiftAwayCursor('Description');
			kw.okOrCancelForValidation('Yes');
			kw.sleep();
			kw.modifyCellValueByColumnName('Reference', moduleDATA.header_container.test_save_and_search.REFERENCE); // jshint ignore:line
			kw.modifyCellValueByColumnName('Planned Start', moduleDATA.header_container.test_save_and_search.PLANNED_START); // jshint ignore:line
			kw.modifyCellValueByColumnName('Quantity', moduleDATA.header_container.test_save_and_search.QUANTITY); // jshint ignore:line
			kw.modifyComboLookupCellByColumnName('Package Type', moduleDATA.header_container.test_save_and_search.PACKAGE_TYPE); // jshint ignore:line
			kw.modifyDialogCellByColumnName('Requisition Owner', moduleDATA.header_container.test_save_and_search.RESPONSIBLE_OWNER); // jshint ignore:line
			// kw.modifyDropDownLookupByColumnName('Tax Code',moduleDATA.header_container.test_save_and_search.TAX_CODE);
			kw.modifyCellValueByColumnName('Remarks', moduleDATA.header_container.test_save_and_search.REMARKS); // jshint ignore:line
			kw.modifyDropDownLookupByColumnName('Schedule', moduleDATA.header_container.test_save_and_search.SCHEDULE); // jshint ignore:line
			kw.modifyDropDownLookupByColumnName('Activity', moduleDATA.header_container.test_save_and_search.ACTIVITY); // jshint ignore:line
			kw.shiftAwayCursor('Schedule');
			kw.okOrCancelForValidation('Accept');
			kw.sleep();
			kw.clickSave();
			kw.clickRefresh();
			kw.clickSearchWithInputValue(moduleDATA.header_container.test_save_and_search.CODE); // jshint ignore:line
			kw.clickGoToNext();
			kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (count) {
				// noinspection JSUnresolvedFunction
				expect(count).toBe(afterAdd + 1);
				console.log('save and search button are working');
				kw.sleep();
				kw.clickDelete();
				kw.clickSave();
			});

		});

	});
	// noinspection JSUnresolvedFunction
	it('clear database ', function () {
		kw.updateTestDatabaseTestData('delete from PRC_GENERALS where  whoisr=173');
		kw.updateTestDatabaseTestData('delete from PRC_CERTIFICATE where  whoisr=173');
		kw.updateTestDatabaseTestData('delete from PRC_PACKAGE2HEADER where whoisr=173');
		kw.updateTestDatabaseTestData('delete from PRC_PACKAGE where  whoisr=173');
	});
});