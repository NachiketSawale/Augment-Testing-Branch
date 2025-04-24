(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		// specs: ['scheduling-calendar-tile-exists-spec.js']
		// specs: ['scheduling-calendar-module-opens-spec.js']
		// specs: ['scheduling-calendar-all-mains-selectable-spec.js']
		// specs: ['scheduling-calendar-check-layout-editor-spec.js']
		// specs: ['scheduling-calendar-check-open-all-container-spec.js']
		// specs: ['scheduling-calendar-create-delete-in-sub-container-spec.js']
		specs: ['scheduling-calendar-create-delete-in-root-container-spec.js']
		// specs: ['*-spec.js']
	});
})();
