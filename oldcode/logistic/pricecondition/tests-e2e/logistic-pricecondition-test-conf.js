(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['logistic-pricecondition-tile-exists-spec.js']
		//specs: ['logistic-pricecondition-module-opens-spec.js']
		//specs: ['logistic-pricecondition-all-mains-selectable-spec.js']
		//specs: ['logistic-pricecondition-check-layout-editor-spec.js']
		//specs: ['logistic-pricecondition-check-open-all-container-spec.js']
		//specs: ['logistic-pricecondition-create-delete-in-sub-container-spec.js']
		specs: ['logistic-pricecondition-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
