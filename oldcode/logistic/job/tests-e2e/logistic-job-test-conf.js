(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['logistic-job-tile-exists-spec.js']
		//specs: ['logistic-job-module-opens-spec.js']
		//specs: ['logistic-job-all-mains-selectable-spec.js']
		//specs: ['logistic-job-check-layout-editor-spec.js']
		//specs: ['logistic-job-check-open-all-container-spec.js']
		//specs: ['logistic-job-create-delete-in-root-container-spec.js']
		specs: ['logistic-job-create-delete-in-sub-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
