(function () {
	'use strict';
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-characteristic-tile-exists-spec.js']
		//specs: ['basics-characteristic-module-opens-spec.js']
		//specs: ['basics-characteristic-all-mains-selectable-spec.js']
		//specs: ['basics-characteristic-check-layout-editor-spec.js']
		specs: ['basics-characteristic-check-open-all-container-spec.js']
		//specs: ['basics-characteristic-create-delete-in-sub-container-spec.js']
		//specs: ['basics-characteristic-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();