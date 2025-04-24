(function() {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global require,module */

	// --------------------------------------------------------
	// Basics bank module configuration
	let iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		// specs: ['businesspartner-evaluationschema-tile-exists-spec.js']
		// specs: ['businesspartner-evaluationschema-module-opens-spec.js']
		// specs: ['businesspartner-evaluationschema-all-mains-selectable-spec.js']
		// specs: ['businesspartner-evaluationschema-check-layout-editor-spec.js']
		specs: ['businesspartner-evaluationschema-check-open-all-container-spec.js']
		// specs: ['businesspartner-evaluationschema-create-delete-in-sub-container-spec.js']
		// specs: ['businesspartner-evaluationschema-create-delete-in-root-container-spec.js']
		// specs: ['*-spec.js']
	});
})();