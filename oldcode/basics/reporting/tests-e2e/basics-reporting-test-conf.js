(function () {
	'use strict';
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-reporting-tile-exists-spec.js']
		//specs: ['basics-reporting-module-opens-spec.js']
		//specs: ['basics-reporting-all-mains-selectable-spec.js']
		//specs: ['basics-reporting-check-layout-editor-spec.js']
		specs: ['basics-reporting-check-open-all-container-spec.js']
		//specs: ['basics-reporting-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();