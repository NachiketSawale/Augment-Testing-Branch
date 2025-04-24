(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare,no-unused-vars
	/* global angular,require,module */

	// --------------------------------------------------------
	// Basics bank module configuration
	let iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		// specs: ['businesspartner-main-tile-exists-spec.js']
		// specs: ['businesspartner-main-module-opens-spec.js']
		// specs: ['businesspartner-main-all-mains-selectable-spec.js']
		// specs: ['businesspartner-main-check-layout-editor-spec.js']
		// specs: ['businesspartner-main-check-open-all-container-spec.js']
		specs: ['businesspartner-main-create-delete-in-root-container-spec.js']
		// specs: ['businesspartner-main-create-delete-in-sub-container-spec.js']
		// specs: ['*-spec.js']
	});
})();