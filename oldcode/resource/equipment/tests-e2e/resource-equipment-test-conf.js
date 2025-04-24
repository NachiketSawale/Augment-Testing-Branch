(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['resource-equipment-tile-exists-spec.js']
		//specs: ['resource-equipment-module-opens-spec.js']
		//specs: ['resource-equipment-all-mains-selectable-spec.js']
		//specs: ['resource-equipment-check-layout-editor-spec.js']
		//specs: ['resource-equipment-check-open-all-container-spec.js']
		//specs: ['resource-equipment-create-delete-in-sub-container-spec.js']
		specs: ['resource-equipment-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
