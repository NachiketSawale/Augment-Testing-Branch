(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['project-main-tile-exists-spec.js']
		//specs: ['project-main-module-opens-spec.js']
		//specs: ['project-main-all-mains-selectable-spec.js']
		//specs: ['project-main-check-layout-editor-spec.js']
		//specs: ['project-main-create-entity-spec.js']
		//specs: ['project-main-check-open-all-container-spec.js']
		//specs: ['project-main-container-test-spec.js']
		specs: ['project-main-create-delete-in-sub-container-spec.js']
	});
})();
