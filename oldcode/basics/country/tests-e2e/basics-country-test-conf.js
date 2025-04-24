(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-country-tile-exists-spec.js']
		//specs: ['basics-country-module-opens-spec.js']
		//specs: ['basics-country-all-mains-selectable-spec.js']
		//specs: ['basics-country-check-layout-editor-spec.js']
		//specs: ['basics-country-check-open-all-container-spec.js']
		//specs: ['basics-country-create-delete-in-sub-container-spec.js']
		specs: ['basics-country-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
