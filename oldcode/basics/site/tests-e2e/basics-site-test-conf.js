(function () {
	'use strict';
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-site-tile-exists-spec.js']
		//specs: ['basics-site-module-opens-spec.js']
		//specs: ['basics-site-all-mains-selectable-spec.js']
		//specs: ['basics-site-check-layout-editor-spec.js']
		//specs: ['basics-site-check-open-all-container-spec.js']
		//specs: ['basics-site-create-delete-in-sub-container-spec.js']
		specs: ['basics-site-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();