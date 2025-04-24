(function () {
	'use strict';
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['resource-maintenance-tile-exists-spec.js']
		//specs: ['resource-maintenance-module-opens-spec.js']
		//specs: ['resource-maintenance-all-mains-selectable-spec.js']
		//specs: ['resource-maintenance-check-layout-editor-spec.js']
		specs: ['resource-maintenance-check-open-all-container-spec.js']
		//specs: ['resource-maintenance-create-delete-in-sub-container-spec.js']
		//specs: ['resource-maintenance-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();