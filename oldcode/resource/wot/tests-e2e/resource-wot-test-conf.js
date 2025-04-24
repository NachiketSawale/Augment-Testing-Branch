(function () {
	'use strict';
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['resource-wot-tile-exists-spec.js']
		//specs: ['resource-wot-module-opens-spec.js']
		//specs: ['resource-wot-all-mains-selectable-spec.js']
		//specs: ['resource-wot-check-layout-editor-spec.js']
		specs: ['resource-wot-check-open-all-container-spec.js']
		//specs: ['resource-wot-create-delete-in-sub-container-spec.js']
		//specs: ['resource-wot-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();