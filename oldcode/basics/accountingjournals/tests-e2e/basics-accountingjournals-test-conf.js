(function () {
	'use strict';
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		// specs: ['basics-accountingjournals-tile-exists-spec.js']
		// specs: ['basics-accountingjournals-module-opens-spec.js']
		// specs: ['basics-accountingjournals-all-mains-selectable-spec.js']
		// specs: ['basics-accountingjournals-check-layout-editor-spec.js']
		specs: ['basics-accountingjournals-check-open-all-container-spec.js']
		// specs: ['basics-accountingjournals-create-delete-in-sub-container-spec.js']
		// specs: ['basics-accountingjournals-create-delete-in-root-container-spec.js']
		// specs: ['*-spec.js']
	});
})();