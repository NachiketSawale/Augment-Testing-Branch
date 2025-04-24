(function () {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		// specs: ['boq-wic-tile-exists-spec.js']
		// specs: ['boq-wic-module-opens-spec.js']
		// specs: ['boq-wic-all-mains-selectable-spec.js']
		// specs: ['boq-wic-check-layout-editor-spec.js']
		// specs: ['boq-wic-check-open-all-container-spec.js']
		specs: ['boq-wic-create-delete-in-sub-container-spec.js']
		// specs: ['boq-wic-create-delete-in-root-container-spec.js']
		// specs: ['*-spec.js']
	});
})();
