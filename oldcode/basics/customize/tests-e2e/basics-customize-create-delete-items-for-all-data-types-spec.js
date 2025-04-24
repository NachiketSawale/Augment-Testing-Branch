(function(){
	'use strict';

	var assistance = {moduleConfig: require('./basics-customize-module-conf.js')};
	var moduleTest = require('rib-itwo40-e2e').moduleTest;
	var createDeleteTester = require('./basics-customize-creation-delete-test-helper.js');

	var isToBeTested = function isToBeTested(typeDBTable, brokenEntityTables) {
		return createDeleteTester.typeIsToBeTested(typeDBTable, brokenEntityTables);
	};

	var testCreateAndDeleteOnDataType = function testCreateAndDeleteOnDataType(assist, typeNo) {
		return createDeleteTester.testCreateAndDeleteOnDataType(assist, typeNo, isToBeTested);
	};

	describe(moduleTest.moduleMainItemsDoesSupportTitle(assistance, 'create and delete instances'), function() {
		beforeAll(function() {
			browser.driver.manage().window().maximize();
			moduleTest.initialize(assistance, jasmine).then(function() {// jshint ignore: line
				moduleTest.openModuleBeforeTest(assistance);
			});
		});

		it(moduleTest.moduleMainItemsDoesSupportSpec(assistance, 'create and delete instances'), function() {
			moduleTest.iterateOverAndTestOnAllMainItems(assistance, testCreateAndDeleteOnDataType);
		}, moduleTest.getDurationMainItemSelectionTest(assistance));

		afterAll(function () {
			moduleTest.finalize(assistance);
		});
	});
})();
