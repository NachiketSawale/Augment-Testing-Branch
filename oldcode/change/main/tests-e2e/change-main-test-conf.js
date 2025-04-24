(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['change-main-tile-exists-spec.js']
		//specs: ['change-main-module-opens-spec.js']
		//specs: ['change-main-all-mains-selectable-spec.js']
		//specs: ['change-main-check-layout-editor-spec.js']
		//specs: ['change-main-check-open-all-container-spec.js']
		//specs: ['change-main-create-delete-in-sub-container-spec.js']
		specs: ['change-main-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
