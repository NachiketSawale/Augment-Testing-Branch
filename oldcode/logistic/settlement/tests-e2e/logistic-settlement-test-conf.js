(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['logistic-settlement-tile-exists-spec.js']
		//specs: ['logistic-settlement-module-opens-spec.js']
		//specs: ['logistic-settlement-all-mains-selectable-spec.js']
		//specs: ['logistic-settlement-check-layout-editor-spec.js']
		//specs: ['logistic-settlement-check-open-all-container-spec.js']
		//specs: ['logistic-settlement-create-delete-in-sub-container-spec.js']
		specs: ['logistic-settlement-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
