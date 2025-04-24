/**
 * Created by hni on 2015/11/25.
 */
var MAPPING = require('framework').mapping;
var LOCATOR = require('framework').locator;
var API = require('framework').api;
var WMAP = require('./mapping.js');
var WDATA = require('./data.js');
describe('package wizard test', function () {

	var kw;

	beforeEach(function () {
		kw = API.createNewAPI();
	});

	afterEach(function () {
		kw = null;
	});

	it('test  open package module and choose a record', function () {
		kw.openWorkspaceModule('Package');
		console.log('open package module and choose a record');
		kw.maxContainerLayout(0, 'Package');
		kw.clickSearchWithInputValue('AUTOTEST');
		kw.selectGrid(WMAP.packageHeaderGrid);
		kw.clickGoToNext();

	});
	it('click change  status wizard title', function () {
		kw.clickSidebarWiard();
		kw.clickWizardTitle('Change Status Wizard');
	});
	it('test package wizard:change package status', function () {
		kw.clickWizardByWizardName('Change Package Status');
		kw.chooseAStatusByStatusName(WDATA.CHANGE_PACKAGE_STATUS.TARGET_STATUS);
		browser.sleep(300);
		kw.chenckWhetherStatusChange('OK');
		kw.selectGrid(WMAP.packageHeaderGrid).count().then(function (count) {
			kw.selectGridRow(0);
			var status = kw.getCellTextByColumnName('Status');
			expect(status).toBe(WDATA.CHANGE_PACKAGE_STATUS.TARGET_STATUS);
		});
	});
	it('test package wizard:change  status for item', function () {
		kw.maxContainerLayout(1, 'Items');
		kw.selectGrid(WMAP.packageItemsGrid);
		kw.selectGridRow(0);
		kw.clickSidebarWiard();
		kw.clickWizardTitle('Change Status Wizard');
		kw.clickWizardByWizardName('Change Status For Item');
		kw.chooseAStatusByStatusName(WDATA.CHANGE_ITEM_STATUS.TARGET_STATUS);
		browser.sleep(300);
		kw.chenckWhetherStatusChange('OK');
		var status = kw.getCellTextByColumnName('Status');
		expect(status).toBe(WDATA.CHANGE_ITEM_STATUS.TARGET_STATUS);
	});
	it('test package wizard:Create Requisition', function () {
		kw.clickSave();
		kw.shiftTab(0);
		kw.clickSidebarWiard();
		kw.clickWizardTitle('Create Wizard');
		kw.clickWizardByWizardName('Create Requisition');
		kw.clickDialogRowForWizard(0);
		kw.clickOKOrCancelButtonForValidation('OK');// ok for create requisition
		kw.clickOKOrCancelButtonForValidation('OK');// ok for go to requisition module
		browser.sleep(300);
		kw.setCurrentModule('Requisition');
		kw.selectGrid(WMAP.reqHeaderGrid).count().then(function (count) {
			expect(count).toBe(1);
		});
	});
	it('test package wizard:Evaluation Events', function () {
		kw.openWorkspaceModule('Package');
		kw.clickSearchWithInputValue('AUTOTEST');
		kw.selectGrid(WMAP.packageHeaderGrid);
		kw.clickGoToNext();
		kw.clickSidebarWiard();
		kw.clickWizardTitle('Update Wizard');
		kw.clickWizardByWizardName('Evaluation Events');
		browser.sleep(300);
		kw.getDialogMessage().then(function (message) {
			expect(message).toContain('Package Events updated!');
		});
		kw.clickOKOrCancelButtonForValidation('OK');
	});
	it('test package wizard:Update Procurement Schedule', function () {
		kw.clickSave();
		kw.clickSidebarWiard();
		kw.clickWizardTitle('Update Wizard');
		kw.clickWizardByWizardName('Update Procurement Schedule');
		browser.sleep(300);
		kw.getDialogMessage().then(function (message) {
			expect(message).toContain('Package scheduling activities updated!');
		});
		kw.clickOKOrCancelButtonForValidation('OK');
	});
	it('restore database', function () {
		kw.updateTestDatabaseTestData('update prc_package set prc_packagestatus_fk=1 where code="autotest"');
		kw.updateTestDatabaseTestData('UPDATE PRC_ITEM SET PRC_ITEMSTATUS_FK=1 where ITEMNO=99');
	});
});