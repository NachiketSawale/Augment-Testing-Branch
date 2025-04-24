(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	let iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['estimate-assemblies-tile-exists-spec.js']
		//specs: ['estimate-assemblies-module-opens-spec.js']
		//specs: ['estimate-assemblies-all-mains-selectable-spec.js']
		//specs: ['estimate-assemblies-check-layout-editor-spec.js']
		//specs: ['estimate-assemblies-check-open-all-container-spec.js']
		specs: ['estimate-assemblies-create-delete-in-sub-container-spec.js']
		//specs: ['estimate-assemblies-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
