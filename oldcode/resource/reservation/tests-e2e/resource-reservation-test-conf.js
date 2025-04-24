(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['resource-reservation-tile-exists-spec.js']
		//specs: ['resource-reservation-module-opens-spec.js']
		//specs: ['resource-reservation-all-mains-selectable-spec.js']
		//specs: ['resource-reservation-check-layout-editor-spec.js']
		//specs: ['resource-reservation-check-open-all-container-spec.js']
		//specs: ['resource-reservation-create-delete-in-sub-container-spec.js']
		specs: ['resource-reservation-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
