/**
 * Created by hni on 7/22/2016.
 */

// eslint-disable-next-line strict
'use strict';

var MAPPING = require('framework').mapping; // jshint ignore:line
var LOCATOR = require('framework').locator; // jshint ignore:line
var API = require('framework').api;
var moduleMAPPING = require('./contract-mapping');
var moduleDATA = require('./contract-data');

//noinspection JSUnresolvedFunction
// eslint-disable-next-line strict
// eslint-disable-next-line strict
describe(' contract module header container test', function () {

	var kw;

	//noinspection JSUnresolvedFunction
	beforeEach(function () { // jshint ignore: line
		kw = API.createNewAPI();
		kw.avoidException();
	});

	//noinspection JSUnresolvedFunction
	afterEach(function () { // jshint ignore: line
		kw = null;
	});

	//noinspection JSUnresolvedFunction
	it('test  open contract  module', function () {
		kw.openWorkspaceModule('Contract');
		console.log('open contract module successfully');
		kw.maxContainerLayout(0, 'Contracts');
	});

	//noinspection JSUnresolvedFunction
	it('test the contract header container works,click the refresh and it will load data', function () {
		kw.selectGrid(moduleMAPPING.HeaderGridContainer);
		kw.clickRefresh();
		kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (count) {
			//noinspection JSUnresolvedFunction
			expect(count).not.toBe(0);
			console.log('contract header load data successfully');
		});
	});
	//noinspection JSUnresolvedFunction
	it('test  add  and delete button are working ', function () {
		kw.selectGrid(moduleMAPPING.HeaderGridContainer);
		kw.clickDiscard();
		kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (beforeAdd) {
			kw.clickAdd();
			kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (afterAdd) {
				//noinspection JSUnresolvedFunction
				expect(afterAdd).toBe(beforeAdd + 1);
				console.log('add  record button works');
			});
		});
		kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (beforeDelete) {
			kw.clickDelete();
			kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (afterDelete) {
				//noinspection JSUnresolvedFunction
				expect(afterDelete).toBe(beforeDelete - 1);
				console.log('delete button works');
			});
		});
	});
	//noinspection JSUnresolvedFunction
	it('test  save and search are working', function () {
		kw.updateTestDatabaseTestData('delete from con_header where code="AUTO_2016"');
		kw.selectGrid(moduleMAPPING.HeaderGridContainer);
		kw.clickSearchWithInputValue(moduleDATA.header_container.test_save_and_search.CODE);// jshint ignore:line
		kw.clickAdd();
		kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (afterAdd) {
			afterAdd--;
			kw.selectGridRow(afterAdd);
			kw.modifyComboLookupCellByColumnName('Configuration', moduleDATA.header_container.test_save_and_search.CONFIGURATION);// jshint ignore:line
			kw.modifyCellValueByColumnName('Reference Name', moduleDATA.header_container.test_save_and_search.REFERENCE_NAME);// jshint ignore:line
			kw.modifyCellValueByColumnName('Reference', moduleDATA.header_container.test_save_and_search.CODE);// jshint ignore:line
			kw.modifyDialogCellByColumnName('Project No.', moduleDATA.header_container.test_save_and_search.PROJECT_NAME);// jshint ignore:line
			kw.shiftAwayCursor('Reference');
			kw.setDialogValueByButtonForValidation('Business Partner', moduleDATA.header_container.test_save_and_search.BUSINESS_PARTNER);// jshint ignore:line
			kw.okOrCancelForValidation('OK');
			kw.modifyDialogCellByColumnName('Package Code', moduleDATA.header_container.test_save_and_search.PACKAGE);// jshint ignore:line
			kw.shiftAwayCursor('Project No.');
			kw.modifyComboLookupCellByColumnName('Strategy', moduleDATA.header_container.test_save_and_search.STRATEGY);// jshint ignore:line
			kw.modifyDialogCellByColumnName('Requisition Owner', moduleDATA.header_container.test_save_and_search.RESPONSIBLE_OWNER);// jshint ignore:line
			kw.modifyComboLookupCellByColumnName('Currency', moduleDATA.header_container.test_save_and_search.CURRENCY);// jshint ignore:line
			kw.modifyDropDownLookupByColumnName('Change Request', moduleDATA.header_container.test_save_and_search.CHANGE_REQUEST);// jshint ignore:line
			//kw.modifyDialogCellByColumnName('Basis Contract',moduleDATA.header_container.test_save_and_search.BASIS_CONTRACT);
			kw.modifyDropDownLookupByColumnName('Payment Term (FI)', moduleDATA.header_container.test_save_and_search.PAYMENT_TERM_FI);// jshint ignore:line
			kw.modifyDropDownLookupByColumnName('Payment Term (PA)', moduleDATA.header_container.test_save_and_search.PAYMENT_TERM_PA);// jshint ignore:line
			kw.modifyComboLookupCellByColumnName('Award Method', moduleDATA.header_container.test_save_and_search.AWARD_METHOD);// jshint ignore:line
			kw.modifyComboLookupCellByColumnName('Contract Type', moduleDATA.header_container.test_save_and_search.CONTRACT_TYPE);// jshint ignore:line
			kw.modifyCellValueByColumnName('Reported', moduleDATA.header_container.test_save_and_search.REPORTED);// jshint ignore:line
			kw.modifyComboLookupCellByColumnName('Type', moduleDATA.header_container.test_save_and_search.TYPE);// jshint ignore:line
			kw.modifyDialogCellByColumnName('Controlling Unit Code', moduleDATA.header_container.test_save_and_search.CONTROLLING_UNIT);// jshint ignore:line
			// kw.modifyComboLookupCellByColumnName('Billing Schema',moduleDATA.header_container.test_save_and_search.BILLING_SCHEMA);
			//kw.modifyDialogCellByColumnName('Business Partner',moduleDATA.header_container.test_save_and_search.BUSINESS_PARTNER);
			//kw.shiftAwayCursor('Billing Schema');
			kw.modifyDialogCellByColumnName('Business Partner Agent', moduleDATA.header_container.test_save_and_search.BUSINESS_PARTNER_AGENT);// jshint ignore:line
			kw.modifyComboLookupCellByColumnName('Incoterms', moduleDATA.header_container.test_save_and_search.INCOTERMS);// jshint ignore:line
			kw.modifyCellValueByColumnName('Remarks', moduleDATA.header_container.test_save_and_search.REMARKS);// jshint ignore:line
			kw.shiftAwayCursor('Incoterms');
			kw.clickSave();
			kw.clickRefresh();
			kw.clickSearchWithInputValue(moduleDATA.header_container.test_save_and_search.CODE);// jshint ignore:line
			kw.clickGoToNext();
			kw.selectGrid(moduleMAPPING.HeaderGridContainer).count().then(function (count) {
				//noinspection JSUnresolvedFunction
				expect(count).toBe(afterAdd + 1);
				console.log('save and search button are working');
				kw.sleep();
				kw.clickDelete();
				kw.clickSave();
			});

		});

	});
	//noinspection JSUnresolvedFunction
	it('clear database ', function () {
		kw.updateTestDatabaseTestData('delete from PRC_ITEM where whoisr=173');
		kw.updateTestDatabaseTestData('delete from PRC_GENERALS where  whoisr=173');
		kw.updateTestDatabaseTestData('delete from PRC_CERTIFICATE where  whoisr=173');
		kw.updateTestDatabaseTestData('delete from CON_HEADER where  whoisr=173');
	});
});