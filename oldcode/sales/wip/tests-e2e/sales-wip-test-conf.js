(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		// specs: ['sales-wip-tile-exists-spec.js']
		// specs: ['sales-wip-module-opens-spec.js']
		// specs: ['sales-wip-all-mains-selectable-spec.js']
		// specs: ['sales-wip-check-layout-editor-spec.js']
		specs: ['sales-wip-check-open-all-container-spec.js']
		// specs: ['sales-wip-create-delete-in-sub-container-spec.js']
		// specs: ['*-spec.js']
	});
})();
