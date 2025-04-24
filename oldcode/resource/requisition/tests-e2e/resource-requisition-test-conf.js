(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['resource-requisition-tile-exists-spec.js']
		//specs: ['resource-requisition-module-opens-spec.js']
		//specs: ['resource-requisition-all-mains-selectable-spec.js']
		//specs: ['resource-requisition-check-layout-editor-spec.js']
		//specs: ['resource-requisition-check-open-all-container-spec.js']
		//specs: ['resource-requisition-create-delete-in-sub-container-spec.js']
		specs: ['resource-requisition-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
