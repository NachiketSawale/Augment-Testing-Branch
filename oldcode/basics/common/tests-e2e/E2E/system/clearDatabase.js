/**
 * Created by hni on 2015/11/24.
 */
'use strict';

var API = require('framework').api;

describe('clear relate database', function () {

	var kw;

	beforeEach(function () {
		kw = API.createNewAPI();
	});

	afterEach(function () {
		kw = null;
	});
	it('delete table where whoisr=259', function () {
		var assertMaster = ['MDC_ASSET_MASTER'];
		var costGroups = ['LIC_COSTGROUP1', 'LIC_COSTGROUP2', 'LIC_COSTGROUP3', 'LIC_COSTGROUP4', 'LIC_COSTGROUP5'];
		var structure = ['PRC_CONFIGURATION2CERT', 'PRC_CONFIGURATION2GENERALS', 'PRC_STRUCTUREACCOUNT', 'PRC_STRUCTUREEVENT', 'PRC_STRUCTURE2EVALUATION',
			'PRC_STRUCTURE2CLERK', 'PRC_STRUCTURE'];
		var materialCatalog = [, 'MDC_MATERIAL_GROUP_CHARVAL', 'MDC_MATERIAL_GROUP_CHAR', 'MDC_MATERIAL_GROUP',
			'MDC_MATERIAL_DISCOUNT_GROUP', 'MDC_MATERIAL_CATALOG'];
		// var material=['MDC_MATERIAL_CHARACTERISTIC','MDC_MATERIALDOCUMENT'];
		var qtoFormula = ['QTO_FORMULA_UOM', 'QTO_COMMENT', 'QTO_FORMULA'];
		var priceCondition = ['PRC_PRICECONDITIONDETAIL', 'PRC_PRICECONDITION'];
		kw.clearTestDatabaseTestData(assertMaster);
		kw.clearTestDatabaseTestData(costGroups);
		kw.clearTestDatabaseTestData(structure);
		kw.clearTestDatabaseTestData(materialCatalog);
		// kw.clearTestDatabaseTestData(material);
		kw.clearTestDatabaseTestData(qtoFormula);
		kw.clearTestDatabaseTestData(priceCondition);
		browser.close();
	});
});
