(function () {
	'use strict';
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-controllingcostcodes-tile-exists-spec.js']
		//specs: ['basics-controllingcostcodes-module-opens-spec.js']
		//specs: ['basics-controllingcostcodes-all-mains-selectable-spec.js']
		//specs: ['basics-controllingcostcodes-check-layout-editor-spec.js']
		//specs: ['basics-controllingcostcodes-check-open-all-container-spec.js']
		//specs: ['basics-controllingcostcodes-create-delete-in-sub-container-spec.js']
		specs: ['basics-controllingcostcodes-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();