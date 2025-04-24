/**
 * Created by hni on 2015/7/23.
 */

(function () {
'use strict';

var MAPPING = require('framework').mapping;
var LOCATOR = require('framework').locator;
var API = require('framework').api;
var MDCMAPPING = require('./material-catalog-mapping');
var MDCCDATA = require('./material-catalog-data');

describe('test material catalog header container', function () {

	var kw;

	beforeEach(function () {
		kw = API.createNewAPI();
		kw.avoidException();
	});

	afterEach(function () {
		kw = null;
	});

	it('material catalog header  Open Module', function () {
		kw.openAdministrationModule('Material Catalog');
		console.log('open Material Catalog module successfully');
		kw.maxContainerLayout(0, 'Material Catalogs');
	});
	it('test the header container works,click the refresh and it will load data', function () {
		kw.selectGrid(MDCMAPPING.HeaderGridContainer);
		kw.clickRefresh();
		kw.selectGrid(MDCMAPPING.HeaderGridContainer).count().then(function (count) {
			expect(count).not.toBe(0);
			console.log('material catalog load data successfully');
		});
	});
	it('test  add and delete button are working ', function () {
		kw.selectGrid(MDCMAPPING.HeaderGridContainer);
		kw.clickDiscard();
		kw.selectGrid(MDCMAPPING.HeaderGridContainer).count().then(function (beforeAdd) {
			kw.clickAdd();
			kw.setTextValueForValidation('Code', MDCCDATA.MDC_HEADER.TEST_ADD_DELETE_BUTTON_CASE.CODE);
			kw.setDialogValueByButtonForValidation('Supplier', MDCCDATA.MDC_HEADER.TEST_ADD_DELETE_BUTTON_CASE.SUPPLIER);
			kw.sleep();
			kw.okOrCancelForValidation('OK');
			kw.selectGrid(MDCMAPPING.HeaderGridContainer).count().then(function (afteradd) {
				expect(afteradd).toBe(beforeAdd + 1);
				console.log('add button works');
			});
		});
		kw.selectGrid(MDCMAPPING.HeaderGridContainer).count().then(function (beforedelete) {
			kw.clickDelete();
			kw.clickSave();
			kw.selectGrid(MDCMAPPING.HeaderGridContainer).count().then(function (afterdelete) {
				expect(afterdelete).toBe(beforedelete - 1);
				console.log('delete button works');
			});
		});
	});
	it('test  save and search are working', function () {
		kw.clickDiscard();
		kw.selectGrid(MDCMAPPING.HeaderGridContainer);
		kw.clickAdd();
		kw.setTextValueForValidation('Code', MDCCDATA.MDC_HEADER.TEST_SAVE_SEARCH_CASE.CODE);
		kw.setDialogValueByButtonForValidation('Supplier', MDCCDATA.MDC_HEADER.TEST_SAVE_SEARCH_CASE.SUPPLIER);
		kw.sleep();
		kw.okOrCancelForValidation('OK');
		kw.sleep();
		kw.modifyComboLookupCellByColumnName('Type',MDCCDATA.MDC_HEADER.TEST_SAVE_SEARCH_CASE.TYPE);
		kw.modifyCellValueByColumnName('Description',MDCCDATA.MDC_HEADER.TEST_SAVE_SEARCH_CASE.DESCRIPTION);
		kw.modifyDialogCellByColumnName('Responsible',MDCCDATA.MDC_HEADER.TEST_SAVE_SEARCH_CASE.RESPONSIBLE);
		kw.clickCheckBoxByColumnName('IsTicketSystem');
		kw.modifyDropDownLookupByColumnName('Payment Term',MDCCDATA.MDC_HEADER.TEST_SAVE_SEARCH_CASE.PAYMENT_TERM);
		kw.modifyComboLookupCellByColumnName('Incoterms',MDCCDATA.MDC_HEADER.TEST_SAVE_SEARCH_CASE.INCOTERMS);
		kw.selectGrid(MDCMAPPING.HeaderGridContainer).count().then(function (afteradd) {
			afteradd--;
			kw.selectGridRow(afteradd);
			kw.clickSave();
			kw.clickSearchWithInputValue(MDCCDATA.MDC_HEADER.TEST_SAVE_SEARCH_CASE.CODE);
			kw.clickGoToNext();
			kw.sleep();
			kw.selectGrid(MDCMAPPING.HeaderGridContainer).count().then(function (count) {
				expect(count).toBe(1);
				console.log('save and search button are working');
				var count1=count-1;
				kw.selectGridRowWithFreeRowIndex(count1);
				kw.clickDelete();
				kw.clickSave();
			});

		});

	});
	
	
	it('clear database ', function(){
		kw.updateTestDatabaseTestData('delete from MDC_MATERIAL_CATALOG where whoisr=259');
       
	});
	//it('test whether the type/responsible/Incoterms  default are right', function () {
	//    kw.selectGrid(MDCMAPPING.HeaderGridContainer);
	//    kw.clickAdd();
	//    kw.setCreateValidationInMaterialCatalog('text', 'Code', MDCCDATA.MDC_HEADER.DEFAULT_CASE_CODE);
	//    kw.setCreateValidationInMaterialCatalog('dialog', 'Supplier', '222');
	//    kw.chooseSupplier('222');
	//    browser.sleep(2000);
	//    kw.clickOKOrCancelButtonForValidation('OK');
	//    var typeValue = kw.getCellTextByColumnName('Type');
	//    typeValue.then(function (typeValue1) {
	//        console.log('type default value is: ' + typeValue1);
	//        expect(typeValue1).toBe('neutral material catalogs');
	//    });
	//    var responsibleValue = kw.getCellTextByColumnName('Responsible');
	//    responsibleValue.then(function (responsibleValue1) {
	//        console.log('Responsible default value is: ' + responsibleValue1);
	//        expect(responsibleValue1).toBe('VeLa887');
	//    });
	//    kw.getCellTextByColumnName('Incoterms').then(function (IncotermsValue) {
	//        console.log('Incoterms default value is: ' + IncotermsValue);
	//        expect(IncotermsValue).toBe('EXW');
	//    });
	//});
	//it('check whether islive is true and readonly', function () {
	//    kw.selectGrid(MDCMAPPING.HeaderGridContainer).count().then(function (count) {
	//        count--;
	//        kw.selectGridRow(count);
	//        kw.checkCheckBoxWhetherIsMark(count, 'Active');
	//        kw.checkCheckBoxReadOnlyByColumnName('Active');
	//    })
	//});
	//it('test whether the code should be unique', function () {
	//    kw.clickSearchWithInputValue('AUTOTEST');
	//    kw.selectGrid(MDCMAPPING.HeaderGridContainer);
	//    kw.selectGridRow(0);
	//    kw.modifyCellValueByColumnName('Code', 'AUTOTEST02');
	//    kw.pressKey(protractor.Key.TAB);
	//    kw.getWarning('Code');
	//});
	//it('test bpd/subsidiary/supplier logic:type IS 2 or 3 then the business partner may not be null', function () {
	//    kw.clickSearchWithInputValue('AUTOTEST03');
	//    kw.selectGrid(MDCMAPPING.HeaderGridContainer);
	//    kw.selectGridRow(0);
	//    kw.modifyDialogCellByColumnName('Business Partner', 'RIB  Cloud (Jeff Testing)');
	//    kw.shiftAwayCursor('Supplier Description');
	//    browser.sleep(2000);
	//    kw.modifyLookupCellByColumnName('Type', 'comboBox', 'supplier material catalogs');
	//    kw.pressKey(protractor.Key.TAB);
	//    kw.clickCellClearButton('Business Partner');
	//    kw.shiftAwayCursor('Supplier Description');
	//    kw.getWarning('Business Partner');
	//});
	//it('test bpd/subsidiary/supplier logic:type IS 1 then the business partner allow to be null', function () {
	//    kw.clickSearchWithInputValue('AUTOTEST03');
	//    kw.selectGrid(MDCMAPPING.HeaderGridContainer);
	//    kw.selectGridRow(0);
	//    kw.modifyLookupCellByColumnName('Type', 'comboBox', 'Standard-Materialkatalogtyp');
	//    kw.pressKey(protractor.Key.TAB);
	//    kw.clickCellClearButton('Business Partner');
	//    kw.shiftAwayCursor('Supplier Description');
	//    kw.getCellTextByColumnName('Business Partner').then(function (bpValue) {
	//        expect(bpValue).toMatch('');
	//        console.log('Business Partner is: ' + bpValue + 'allow to be null');
	//    })
	//});
	//it('test bpd/subsidiary/supplier logic:if business partner is null,the subsidiary should be read only', function () {
	//    kw.clickSearchWithInputValue('AUTOTEST03');
	//    kw.selectGrid(MDCMAPPING.HeaderGridContainer);
	//    kw.selectGridRow(0);
	//    kw.modifyLookupCellByColumnName('Type', 'comboBox', 'Standard-Materialkatalogtyp');
	//    kw.pressKey(protractor.Key.TAB);
	//    kw.clickCellClearButton('Business Partner');
	//    kw.shiftAwayCursor('Supplier Description');
	//    kw.checkCellReadOnlyByColumnName('Subsidiary')
	//});
	//it('test bpd/subsidiary/supplier logic:set value to business partner,the subsidiary and supplier will get a default and subsidiary becomes not readonly', function () {
	//    kw.clickSearchWithInputValue('AUTOTEST03');
	//    kw.selectGrid(MDCMAPPING.HeaderGridContainer);
	//    kw.selectGridRow(0);
	//    kw.modifyDialogCellByColumnName('Business Partner', '2D Grafic Ltd.');
	//    kw.shiftAwayCursor('Supplier Description');
	//    kw.getCellTextByColumnName('Subsidiary').then(function (subsidiaryValue) {
	//        expect(subsidiaryValue).toMatch('Adenauerstrasse 10 DE 20000 Hamburg Germany');
	//        console.log('Subsidiary is: ' + subsidiaryValue)
	//    });
	//    kw.getCellTextByColumnName('Supplier').then(function (supplierValue) {
	//        expect(supplierValue).toMatch('20150205LAN');
	//        console.log('Supplier is: ' + supplierValue)
	//    });
	//    kw.checkCellReadOnlyByColumnName('Subsidiary');
	//});
	//it('test bpd/subsidiary/supplier logic:when bpd/subsidiary/supplier are null,then set value to supplier,bp and subsidiary will get relate value ', function () {
	//    kw.clickSearchWithInputValue('AUTOTEST03');
	//    kw.selectGrid(MDCMAPPING.HeaderGridContainer);
	//    kw.selectGridRow(0);
	//    kw.modifyLookupCellByColumnName('Type', 'comboBox', 'Standard-Materialkatalogtyp');
	//    kw.pressKey(protractor.Key.TAB);
	//    kw.clickCellClearButton('Business Partner');
	//    kw.shiftAwayCursor('Supplier Description');
	//    kw.modifyLookupCellByColumnName('Supplier', 'dropDownBox', '100100');
	//    kw.shiftAwayCursor('Supplier Description');
	//    browser.sleep(2000);
	//    kw.getCellTextByColumnName('Subsidiary').then(function (subsidiaryValue) {
	//        console.log('Subsidiary is: ' + subsidiaryValue);
	//        expect(subsidiaryValue).not.match('');
	//    });
	//    kw.getCellTextByColumnName('Business Partner').then(function (bpdValue) {
	//        console.log('Business Partner is: ' + bpdValue);
	//        expect(bpdValue).not.match('');
	//    });
	//    kw.checkCellReadOnlyByColumnName('Subsidiary');
	//});
	//it('test bpd/subsidiary/supplier logic:when bp is null,the subsidiary and supplier become null and subsidairy readonly', function () {
	//    kw.clickSearchWithInputValue('AUTOTEST03');
	//    kw.selectGrid(MDCMAPPING.HeaderGridContainer);
	//    kw.selectGridRow(0);
	//    kw.modifyLookupCellByColumnName('Type', 'comboBox', 'Standard-Materialkatalogtyp');
	//    kw.pressKey(protractor.Key.TAB);
	//    kw.clickCellClearButton('Business Partner');
	//    kw.shiftAwayCursor('Supplier Description');
	//    kw.getCellTextByColumnName('Business Partner').then(function (bpValue) {
	//        expect(bpValue).toMatch('');
	//        console.log('Business Partner is: ' + bpValue + 'allow to be null');
	//    });
	//    kw.getCellTextByColumnName('Subsidiary').then(function (SubsidiaryValue) {
	//        expect(SubsidiaryValue).toMatch('');
	//        console.log('Subsidiary is: ' + SubsidiaryValue + 'allow to be null');
	//    });
	//    kw.getCellTextByColumnName('Supplier').then(function (SupplierValue) {
	//        expect(SupplierValue).toMatch('');
	//        console.log('Supplier is: ' + SupplierValue + 'allow to be null');
	//    });
	//    kw.checkCellReadOnlyByColumnName('Subsidiary');
	//});

});
})();
