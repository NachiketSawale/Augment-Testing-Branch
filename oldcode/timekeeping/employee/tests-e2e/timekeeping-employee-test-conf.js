(function () {
	/* global require module */
	'use strict';
	let iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		// specs: ['timekeeping-employee-tile-exists-spec.js']
		// specs: ['timekeeping-employee-module-opens-spec.js']
		// specs: ['timekeeping-employee-all-mains-selectable-spec.js']
		// specs: ['timekeeping-employee-check-layout-editor-spec.js']          //3 Tests 1 Fails in layoutDialogTest.selectContainerSpec() (not equal)
		specs: ['timekeeping-employee-check-open-all-container-spec.js']
		// specs: ['timekeeping-employee-create-delete-in-root-container-spec.js']
		// specs: ['timekeeping-employee-create-delete-in-sub-container-spec.js']
		// specs: ['*-spec.js']
	});
})();