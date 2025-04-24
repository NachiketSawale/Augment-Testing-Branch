(function () {
	'use strict';
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-config-tile-exists-spec.js']
		//specs: ['basics-config-module-opens-spec.js']
		//specs: ['basics-config-all-mains-selectable-spec.js']
		//specs: ['basics-config-check-layout-editor-spec.js']
		//specs: ['basics-config-check-open-all-container-spec.js']
		specs: ['basics-config-create-delete-in-sub-container-spec.js']
		//specs: ['*-spec.js']
	});
})();