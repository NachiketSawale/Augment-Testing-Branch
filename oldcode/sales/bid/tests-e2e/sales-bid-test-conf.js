(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['sales-bid-tile-exists-spec.js']
		//specs: ['sales-bid-module-opens-spec.js']
		//specs: ['sales-bid-all-mains-selectable-spec.js']
		//specs: ['sales-bid-check-layout-editor-spec.js']
		specs: ['sales-bid-check-open-all-container-spec.js']
		//specs: ['sales-bid-create-delete-in-sub-container-spec.js']
		//specs: ['*-spec.js']
	});
})();
