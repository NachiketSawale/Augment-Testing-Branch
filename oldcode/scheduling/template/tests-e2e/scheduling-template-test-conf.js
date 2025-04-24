(function() {
	/* global module require */
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		// specs: ['scheduling-template-tile-exists-spec.js']
		// specs: ['scheduling-template-module-opens-spec.js']
		// specs: ['scheduling-template-all-mains-selectable-spec.js']
		// specs: ['scheduling-template-check-layout-editor-spec.js']
		// specs: ['scheduling-template-check-open-all-container-spec.js']
		specs: ['scheduling-template-create-delete-in-sub-container-spec.js']
		// specs: ['*-spec.js']
	});
})();
