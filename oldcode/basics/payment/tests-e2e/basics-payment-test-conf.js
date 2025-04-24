(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-payment-tile-exists-spec.js']
		//specs: ['basics-payment-module-opens-spec.js']
		//specs: ['basics-payment-all-mains-selectable-spec.js']
		//specs: ['basics-payment-check-layout-editor-spec.js']
		//specs: ['basics-payment-check-open-all-container-spec.js']
		specs: ['basics-payment-create-delete-in-sub-container-spec.js']
		//specs: ['basics-payment-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
