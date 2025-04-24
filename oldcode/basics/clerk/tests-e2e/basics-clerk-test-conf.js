(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-clerk-tile-exists-spec.js']
		//specs: ['basics-clerk-module-opens-spec.js']
		//specs: ['basics-clerk-all-mains-selectable-spec.js']
		//specs: ['basics-clerk-check-layout-editor-spec.js']
		//specs: ['basics-clerk-check-open-all-container-spec.js']
		specs: ['basics-clerk-create-delete-in-sub-container-spec.js']
		//specs: ['basics-clerk-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
