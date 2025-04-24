/**
 * Created by hni on 7/22/2016.
 */
// jshint ignore: start
'use strict';

// noinspection JSUnusedLocalSymbols
let MAPPING = require('framework').mapping;
// noinspection JSUnusedLocalSymbols
// noinspection JSUnusedLocalSymbols
let LOCATOR = require('framework').locator;/* jshint ignore: line */
let API = require('framework').api;
let moduleMAPPING = require('./requisition-mapping');
let moduleDATA = require('./requisition-data');

describe(' requisition module header container test', function () {

	let kw;

	beforeEach(function () {
		kw = API.createNewAPI();
		kw.avoidException();
	});

	afterEach(function () {
		kw = null;
	});

	it('test  open requisition  module', function () {
		kw.openWorkspaceModule('Requisition');
		console.log('open requisition module successfully');
		kw.maxContainerLayout(0, 'Requisitions');
	});

	it('test the requisition header container works,click the refresh and it will load data', function () {
		kw.selectGrid(moduleMAPPING.HeaderGridContainer);
		kw.clickRefresh();
		kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (count) {
			expect(count).not.toBe(0);
			console.log('requisition header load data successfully');
		});
	});
	it('test  add  and delete button are working ', function () {
		kw.selectGrid(moduleMAPPING.HeaderGridContainer);
		kw.clickDiscard();
		kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (beforeAdd) {
			kw.clickAdd();
			kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (afterAdd) {
				expect(afterAdd).toBe(beforeAdd + 1);
				console.log('add  record button works');
			});
		});
		kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (beforeDelete) {
			kw.clickDelete();
			kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (afterDelete) {
				expect(afterDelete).toBe(beforeDelete - 1);
				console.log('delete button works');
			});
		});
	});
	it('test  save and search are working', function () {
		kw.updateTestDatabaseTestData('delete from req_header where code="AUTO_2016"');
		kw.selectGrid(moduleMAPPING.HeaderGridContainer);
		kw.clickSearchWithInputValue(moduleDATA.header_container.test_save_and_search.CODE);
		kw.clickAdd();
		kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (afterAdd) {
			afterAdd--;
			kw.selectGridRow(afterAdd);
			kw.modifyCellValueByColumnName('Reference',moduleDATA.header_container.test_save_and_search.CODE);
			kw.modifyDialogCellByColumnName('Project No.',moduleDATA.header_container.test_save_and_search.PROJECT_NAME);
			kw.modifyComboLookupCellByColumnName('Currency',moduleDATA.header_container.test_save_and_search.CURRENCY);
			kw.modifyDialogCellByColumnName('Requisition Owner',moduleDATA.header_container.test_save_and_search.RESPONSIBLE_OWNER);
			kw.modifyDropDownLookupByColumnName('Change Request',moduleDATA.header_container.test_save_and_search.CHANGE_REQUEST);
			kw.modifyCellValueByColumnName('Reference Name',moduleDATA.header_container.test_save_and_search.REFERENCE_NAME);
			kw.modifyDialogCellByColumnName('Basis Requisition',moduleDATA.header_container.test_save_and_search.BASIS_REQUISITION);
			kw.modifyDialogCellByColumnName('Framework Contract',moduleDATA.header_container.test_save_and_search.FRAMEWORK_CONTRACT);
			kw.shiftAwayCursor('Basis Requisition');
			kw.modifyCellValueByColumnName('Received',moduleDATA.header_container.test_save_and_search.RECEIVED);
			kw.modifyComboLookupCellByColumnName('Type',moduleDATA.header_container.test_save_and_search.TYPE);
			kw.modifyDialogCellByColumnName('Controlling Unit Code',moduleDATA.header_container.test_save_and_search.CONTROLLING_UNIT);
			kw.modifyDropDownLookupByColumnName('Payment Term (FI)',moduleDATA.header_container.test_save_and_search.PAYMENT_TERM_FI);
			kw.modifyDropDownLookupByColumnName('Payment Term (PA)',moduleDATA.header_container.test_save_and_search.PAYMENT_TERM_PA);
			kw.modifyComboLookupCellByColumnName('Award Method',moduleDATA.header_container.test_save_and_search.AWARD_METHOD);
			kw.modifyComboLookupCellByColumnName('Contract Type',moduleDATA.header_container.test_save_and_search.CONTRACT_TYPE);
			kw.modifyComboLookupCellByColumnName('Strategy',moduleDATA.header_container.test_save_and_search.STRATEGY);
			kw.modifyCellValueByColumnName('Remarks',moduleDATA.header_container.test_save_and_search.REMARKS);
			kw.shiftAwayCursor('Strategy');
			kw.clickSave();
			kw.clickRefresh();
			kw.clickSearchWithInputValue(moduleDATA.header_container.test_save_and_search.CODE);
			kw.clickGoToNext();
			kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (count) {
				expect(count).toBe(afterAdd+1);
				console.log('save and search button are working');
				kw.sleep();
				kw.clickDelete();
				kw.clickSave();
			});

		});

	});
	it('clear database ', function(){
		kw.updateTestDatabaseTestData('delete from PRC_ITEM where whoisr=173');
		kw.updateTestDatabaseTestData('delete from PRC_GENERALS where  whoisr=173');
		kw.updateTestDatabaseTestData('delete from PRC_CERTIFICATE where  whoisr=173');
		kw.updateTestDatabaseTestData('delete from REQ_HEADER where  whoisr=173');
	});
});