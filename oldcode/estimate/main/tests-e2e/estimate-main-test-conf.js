(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	let iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		// specs: ['estimate-main-tile-exists-spec.js']
		// specs: ['estimate-main-module-opens-spec.js']
		// specs: ['estimate-main-all-mains-selectable-spec.js']
		// specs: ['estimate-main-check-layout-editor-spec.js']
		specs: ['estimate-main-check-open-all-container-spec.js']
		// specs: ['estimate-main-create-delete-in-sub-container-spec.js']
		// specs: ['estimate-main-create-delete-in-root-container-spec.js']
		// specs: ['*-spec.js']
	});
})();
