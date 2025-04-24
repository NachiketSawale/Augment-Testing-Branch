(function () {
	/* global require module */
	'use strict';
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		// specs: ['timekeeping-recording-tile-exists-spec.js']
		// specs: ['timekeeping-recording-module-opens-spec.js']
		// specs: ['timekeeping-recording-all-mains-selectable-spec.js']
		// specs: ['timekeeping-recording-check-layout-editor-spec.js']
		specs: ['timekeeping-recording-check-open-all-container-spec.js']
		// specs: ['timekeeping-recording-create-delete-in-sub-container-spec.js']
		// specs: ['timekeeping-recording-create-delete-in-root-container-spec.js']
		// specs: ['*-spec.js']
	});
})();