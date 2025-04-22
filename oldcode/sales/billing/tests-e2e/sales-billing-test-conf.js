(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['sales-billing-tile-exists-spec.js']
		//specs: ['sales-billing-module-opens-spec.js']
		//specs: ['sales-billing-all-mains-selectable-spec.js']
		//specs: ['sales-billing-check-layout-editor-spec.js']
		specs: ['sales-billing-check-open-all-container-spec.js']
		//specs: ['sales-billing-create-delete-in-sub-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
