/* global module, require */
(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		// specs: ['scheduling-main-tile-exists-spec.js']
		// specs: ['scheduling-main-module-opens-spec.js']
		// specs: ['scheduling-main-all-mains-selectable-spec.js']
		// specs: ['scheduling-main-check-layout-editor-spec.js']
		// specs: ['scheduling-main-check-open-all-container-spec.js']
		// specs: ['scheduling-main-create-delete-in-sub-container-spec.js']
		specs: ['scheduling-main-create-delete-in-root-container-spec.js']
		// specs: ['*-spec.js']
	});
})();
