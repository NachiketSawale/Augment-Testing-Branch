(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-workflowadministration-tile-exists-spec.js']
		//specs: ['basics-workflowadministration-module-opens-spec.js']
		//specs: ['basics-workflowadministration-all-mains-selectable-spec.js']
		//specs: ['basics-workflowadministration-check-layout-editor-spec.js']
		specs: ['basics-workflowadministration-check-open-all-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
