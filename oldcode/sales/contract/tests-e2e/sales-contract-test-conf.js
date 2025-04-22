(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['sales-contract-tile-exists-spec.js']
		//specs: ['sales-contract-module-opens-spec.js']
		//specs: ['sales-contract-all-mains-selectable-spec.js']
		//specs: ['sales-contract-check-layout-editor-spec.js']
		specs: ['sales-contract-check-open-all-container-spec.js']
		//specs: ['sales-contract-create-delete-in-sub-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
