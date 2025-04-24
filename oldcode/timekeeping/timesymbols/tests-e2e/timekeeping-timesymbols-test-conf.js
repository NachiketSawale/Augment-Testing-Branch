(function () {
	/* global require module */
	'use strict';
	let iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		// specs: ['timekeeping-timesymbols-tile-exists-spec.js']
		// specs: ['timekeeping-timesymbols-module-opens-spec.js']
		// specs: ['timekeeping-timesymbols-all-mains-selectable-spec.js']
		specs: ['timekeeping-timesymbols-check-layout-editor-spec.js']          // 3 Tests 1 Fails in layoutDialogTest.selectContainerSpec() (not equal)
		// specs: ['timekeeping-timesymbols-check-open-all-container-spec.js']
		// specs: ['timekeeping-timesymbols-create-delete-in-sub-container-spec.js']
		// specs: ['*-spec.js']
	});
})();
