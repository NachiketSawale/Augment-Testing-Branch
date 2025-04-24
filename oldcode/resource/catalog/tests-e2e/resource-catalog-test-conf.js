(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['resource-catalog-tile-exists-spec.js']
		//specs: ['resource-catalog-module-opens-spec.js']
		//specs: ['resource-catalog-all-mains-selectable-spec.js']
		//specs: ['resource-catalog-check-layout-editor-spec.js']
		specs: ['resource-catalog-check-open-all-container-spec.js']
		//specs: ['resource-catalog-create-delete-in-root-container-spec.js']
		//specs: ['resource-catalog-create-delete-in-sub-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
