(function () {
	'use strict';
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-workflow-tile-exists-spec.js']
		//specs: ['basics-workflow-module-opens-spec.js']
		//specs: ['basics-workflow-all-mains-selectable-spec.js']
		//specs: ['basics-workflow-check-layout-editor-spec.js']
		specs: ['basics-workflow-check-open-all-container-spec.js']
		//specs: ['basics-workflow-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();