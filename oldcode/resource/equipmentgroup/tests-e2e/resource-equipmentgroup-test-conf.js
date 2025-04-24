(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['resource-equipmentgroup-tile-exists-spec.js']
		//specs: ['resource-equipmentgroup-module-opens-spec.js']
		//specs: ['resource-equipmentgroup-all-mains-selectable-spec.js']
		//specs: ['resource-equipmentgroup-check-layout-editor-spec.js']
		specs: ['resource-equipmentgroup-check-open-all-container-spec.js']
		//specs: ['resource-equipmentgroup-create-delete-in-root-container-spec.js']
		//specs: ['resource-equipmentgroup-create-delete-in-sub-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
