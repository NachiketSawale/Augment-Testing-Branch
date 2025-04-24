(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-company-tile-exists-spec.js']
		//specs: ['basics-company-module-opens-spec.js']
		//specs: ['basics-company-all-mains-selectable-spec.js']
		//specs: ['basics-company-check-layout-editor-spec.js']
		//specs: ['basics-company-check-open-all-container-spec.js']
		//specs: ['basics-company-create-delete-in-sub-container-spec.js']
		specs: ['basics-company-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
