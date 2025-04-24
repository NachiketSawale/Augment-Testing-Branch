(function () {
	'use strict';
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-dependentdata-tile-exists-spec.js']
		//specs: ['basics-dependentdata-module-opens-spec.js']
		//specs: ['basics-dependentdata-all-mains-selectable-spec.js']
		//specs: ['basics-dependentdata-check-layout-editor-spec.js']
		//specs: ['basics-dependentdata-check-open-all-container-spec.js']
		specs: ['basics-dependentdata-create-delete-in-sub-container-spec.js']
		//specs: ['basics-dependentdata-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();