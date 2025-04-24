(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-bank-tile-exists-spec.js']
		//specs: ['basics-bank-module-opens-spec.js']
		//specs: ['basics-bank-all-mains-selectable-spec.js']
		//specs: ['basics-bank-check-layout-editor-spec.js']
		//specs: ['basics-bank-check-open-all-container-spec.js']
		specs: ['basics-bank-create-delete-in-sub-container-spec.js']
		//specs: ['basics-bank-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();