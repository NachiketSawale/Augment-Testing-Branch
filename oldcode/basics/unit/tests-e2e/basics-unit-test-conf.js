(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-unit-tile-exists-spec.js']
		//specs: ['basics-unit-module-opens-spec.js']
		//specs: ['basics-unit-all-mains-selectable-spec.js']
		//specs: ['basics-unit-check-layout-editor-spec.js']
		//specs: ['basics-unit-check-open-all-container-spec.js']
		//specs: ['basics-unit-create-delete-in-sub-container-spec.js']
		specs: ['basics-unit-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
