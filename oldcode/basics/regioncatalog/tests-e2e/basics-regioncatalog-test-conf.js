(function () {
	'use strict';
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-regioncatalog-tile-exists-spec.js']
		//specs: ['basics-regioncatalog-module-opens-spec.js']
		//specs: ['basics-regioncatalog-all-mains-selectable-spec.js']
		//specs: ['basics-regioncatalog-check-layout-editor-spec.js']
		specs: ['basics-regioncatalog-check-open-all-container-spec.js']
		//specs: ['basics-regioncatalog-create-delete-in-sub-container-spec.js']
		//specs: ['*-spec.js']
	});
})();