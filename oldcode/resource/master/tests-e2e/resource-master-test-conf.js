(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['resource-master-tile-exists-spec.js']
		//specs: ['resource-master-module-opens-spec.js']
		//specs: ['resource-master-all-mains-selectable-spec.js']
		//specs: ['resource-master-check-layout-editor-spec.js']
		//specs: ['resource-master-check-open-all-container-spec.js']
		//specs: ['resource-master-create-delete-in-sub-container-spec.js']
		specs: ['resource-master-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
