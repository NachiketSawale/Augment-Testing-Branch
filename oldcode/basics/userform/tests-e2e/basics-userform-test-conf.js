(function () {
	'use strict';
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-userform-tile-exists-spec.js']
		//specs: ['basics-userform-module-opens-spec.js']
		//specs: ['basics-userform-all-mains-selectable-spec.js']
		//specs: ['basics-userform-check-layout-editor-spec.js']
		//specs: ['basics-userform-check-open-all-container-spec.js']
		//specs: ['basics-userform-create-delete-in-sub-container-spec.js']
		specs: ['basics-userform-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();