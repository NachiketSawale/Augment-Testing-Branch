(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['logistic-sundrygroup-tile-exists-spec.js']
		//specs: ['logistic-sundrygroup-module-opens-spec.js']
		//specs: ['logistic-sundrygroup-all-mains-selectable-spec.js']
		//specs: ['logistic-sundrygroup-check-layout-editor-spec.js']
		specs: ['logistic-sundrygroup-check-open-all-container-spec.js']
		//specs: ['logistic-sundrygroup-create-delete-in-root-container-spec.js']
		//specs: ['logistic-sundrygroup-create-delete-in-sub-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
