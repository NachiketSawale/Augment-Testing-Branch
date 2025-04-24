(function () {
	/* global module require */
	'use strict';
	const iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		// specs: ['timekeeping-shiftmodel-tile-exists-spec.js']
		// specs: ['timekeeping-shiftmodel-module-opens-spec.js']
		// specs: ['timekeeping-shiftmodel-all-mains-selectable-spec.js']
		// specs: ['timekeeping-shiftmodel-check-layout-editor-spec.js']          //3 Tests 1 Fails in layoutDialogTest.selectContainerSpec() (not equal)
		specs: ['timekeeping-shiftmodel-check-open-all-container-spec.js']
		// specs: ['timekeeping-shiftmodel-create-delete-in-root-container-spec.js']
		// specs: ['timekeeping-shiftmodel-create-delete-in-sub-container-spec.js']
		// specs: ['*-spec.js']
	});
})();