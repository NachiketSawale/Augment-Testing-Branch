(function () {
	/* global require module */
	'use strict';
	const iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		// specs: ['timekeeping-period-tile-exists-spec.js']
		// specs: ['timekeeping-period-module-opens-spec.js']
		// specs: ['timekeeping-period-all-mains-selectable-spec.js']
		// specs: ['timekeeping-period-check-layout-editor-spec.js']
		specs: ['timekeeping-period-check-open-all-container-spec.js']
		// specs: ['timekeeping-period-create-delete-in-sub-container-spec.js']
		// specs: ['timekeeping-period-create-delete-in-root-container-spec.js']
		// specs: ['*-spec.js']
	});
})();