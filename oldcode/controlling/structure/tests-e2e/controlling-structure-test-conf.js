(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['controlling-structure-tile-exists-spec.js']
		//specs: ['controlling-structure-module-opens-spec.js']
		//specs: ['controlling-structure-all-mains-selectable-spec.js']
		//specs: ['controlling-structure-check-layout-editor-spec.js']
		specs: ['controlling-structure-check-open-all-container-spec.js']
		//specs: ['controlling-structure-create-delete-in-sub-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
