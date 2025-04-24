(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['resource-enterprise-tile-exists-spec.js']
		//specs: ['resource-enterprise-module-opens-spec.js']
		//specs: ['resource-enterprise-all-mains-selectable-spec.js']
		//specs: ['resource-enterprise-check-layout-editor-spec.js']
		//specs: ['resource-enterprise-check-open-all-container-spec.js']
		specs: ['resource-enterprise-create-delete-in-sub-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
