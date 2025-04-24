(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['resource-type-tile-exists-spec.js']
		//specs: ['resource-type-module-opens-spec.js']
		//specs: ['resource-type-all-mains-selectable-spec.js']
		//specs: ['resource-type-check-layout-editor-spec.js']
		//specs: ['resource-type-check-open-all-container-spec.js']
		//specs: ['resource-type-create-delete-in-sub-container-spec.js']
		specs: ['resource-type-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
