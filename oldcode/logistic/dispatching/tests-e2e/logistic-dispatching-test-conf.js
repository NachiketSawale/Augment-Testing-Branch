(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['logistic-dispatching-tile-exists-spec.js']
		//specs: ['logistic-dispatching-module-opens-spec.js']
		//specs: ['logistic-dispatching-all-mains-selectable-spec.js']
		//specs: ['logistic-dispatching-check-layout-editor-spec.js']
		specs: ['logistic-dispatching-check-open-all-container-spec.js']
		//specs: ['logistic-dispatching-create-delete-in-sub-container-spec.js']
		//specs: ['logistic-dispatching-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
