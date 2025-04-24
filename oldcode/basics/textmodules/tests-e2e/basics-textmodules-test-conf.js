(function () {
	'use strict';
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-textmodules-tile-exists-spec.js']
		//specs: ['basics-textmodules-module-opens-spec.js']
		//specs: ['basics-textmodules-all-mains-selectable-spec.js']
		//specs: ['basics-textmodules-check-layout-editor-spec.js']
		//specs: ['basics-textmodules-check-open-all-container-spec.js']
		specs: ['basics-textmodules-create-delete-in-sub-container-spec.js']
		//specs: ['basics-textmodules-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();