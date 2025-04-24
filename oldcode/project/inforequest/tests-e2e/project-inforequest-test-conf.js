(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['project-inforequest-tile-exists-spec.js']
		//specs: ['project-inforequest-module-opens-spec.js']
		//specs: ['project-inforequest-all-mains-selectable-spec.js']
		//specs: ['project-inforequest-check-layout-editor-spec.js']
		//specs: ['project-inforequest-check-open-all-container-spec.js']
		//specs: ['project-inforequest-create-delete-in-sub-container-spec.js']
		specs: ['project-inforequest-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
