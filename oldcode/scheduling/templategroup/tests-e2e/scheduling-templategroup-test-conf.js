(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		// specs: ['scheduling-templategroup-tile-exists-spec.js']
		// specs: ['scheduling-templategroup-module-opens-spec.js']
		// specs: ['scheduling-templategroup-all-mains-selectable-spec.js']
		// specs: ['scheduling-templategroup-check-layout-editor-spec.js']
		// specs: ['scheduling-templategroup-check-open-all-container-spec.js']
		// specs: ['scheduling-templategroup-create-delete-in-sub-container-spec.js']
		specs: ['scheduling-templategroup-create-delete-in-root-container-spec.js']
		// specs: ['*-spec.js']
	});
})();
