(function () {
	'use strict';
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-costcodes-tile-exists-spec.js']
		//specs: ['basics-costcodes-module-opens-spec.js']
		//specs: ['basics-costcodes-all-mains-selectable-spec.js']
		//specs: ['basics-costcodes-check-layout-editor-spec.js']
		specs: ['basics-costcodes-check-open-all-container-spec.js']
		//specs: ['basics-costcodes-create-delete-in-sub-container-spec.js']
		//specs: ['basics-costcodes-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();