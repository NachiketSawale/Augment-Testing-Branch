(function () {
	'use strict';
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-currency-tile-exists-spec.js']
		//specs: ['basics-currency-module-opens-spec.js']
		//specs: ['basics-currency-all-mains-selectable-spec.js']
		//specs: ['basics-currency-check-layout-editor-spec.js']
		//specs: ['basics-currency-check-open-all-container-spec.js']
		//specs: ['basics-currency-create-delete-in-sub-container-spec.js']
		specs: ['basics-currency-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();