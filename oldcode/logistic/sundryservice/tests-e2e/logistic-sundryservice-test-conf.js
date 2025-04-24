(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['logistic-sundryservice-tile-exists-spec.js']
		//specs: ['logistic-sundryservice-module-opens-spec.js']
		//specs: ['logistic-sundryservice-all-mains-selectable-spec.js']
		//specs: ['logistic-sundryservice-check-layout-editor-spec.js']
		//specs: ['logistic-sundryservice-check-open-all-container-spec.js']
		//specs: ['logistic-sundryservice-create-delete-in-sub-container-spec.js']
		specs: ['logistic-sundryservice-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
