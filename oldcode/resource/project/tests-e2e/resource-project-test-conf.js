(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['resource-project-tile-exists-spec.js']
		//specs: ['resource-project-module-opens-spec.js']
		//specs: ['resource-project-all-mains-selectable-spec.js']
		specs: ['resource-project-check-layout-editor-spec.js']
		//specs: ['resource-project-check-open-all-container-spec.js']
		//specs: ['resource-project-create-delete-in-sub-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
