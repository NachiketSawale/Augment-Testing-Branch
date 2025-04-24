(function () {
	'use strict';
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['resource-skill-tile-exists-spec.js']
		//specs: ['resource-skill-module-opens-spec.js']
		//specs: ['resource-skill-all-mains-selectable-spec.js']
		//specs: ['resource-skill-check-layout-editor-spec.js']
		//specs: ['resource-skill-check-open-all-container-spec.js']
		//specs: ['resource-skill-create-delete-in-sub-container-spec.js']
		specs: ['resource-skill-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();