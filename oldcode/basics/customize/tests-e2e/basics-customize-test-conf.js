(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-customize-tile-exists-spec.js']
		//specs: ['basics-customize-module-opens-spec.js']
		//specs: ['basics-customize-all-mains-selectable-spec.js']
		//specs: ['basics-customize-check-layout-editor-spec.js']
		//specs: ['basics-customize-check-open-all-container-spec.js']
		//specs: ['basics-customize-check-broken-entities-can-be-created-spec.js']
		specs: ['basics-customize-create-delete-items-for-all-data-types-spec.js']
		//specs: ['*-spec.js']
	});
})();
