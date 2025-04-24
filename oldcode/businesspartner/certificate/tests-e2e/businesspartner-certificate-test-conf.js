(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global require,module */

	// --------------------------------------------------------
	// Basics bank module configuration
	const iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		// specs: ['businesspartner-certificate-tile-exists-spec.js']
		// specs: ['businesspartner-certificate-module-opens-spec.js']
		// specs: ['businesspartner-certificate-all-mains-selectable-spec.js']
		// specs: ['businesspartner-certificate-check-layout-editor-spec.js']
		// specs: ['businesspartner-certificate-check-open-all-container-spec.js']
		specs: ['businesspartner-certificate-create-delete-in-sub-container-spec.js']
		// specs: ['businesspartner-certificate-create-delete-in-root-container-spec.js']
		// specs: ['*-spec.js']
	});
})();