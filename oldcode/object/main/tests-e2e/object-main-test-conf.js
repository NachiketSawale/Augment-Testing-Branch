(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['object-main-tile-exists-spec.js']
		//specs: ['object-main-module-opens-spec.js']
		//specs: ['object-main-all-mains-selectable-spec.js']
		//specs: ['object-main-check-layout-editor-spec.js']
		//specs: ['object-main-check-open-all-container-spec.js']
		//specs: ['object-main-create-delete-in-sub-container-spec.js']
		specs: ['object-main-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
