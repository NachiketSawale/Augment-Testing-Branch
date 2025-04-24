(function () {
	'use strict';
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['basics-billingschema-tile-exists-spec.js']
		//specs: ['basics-billingschema-module-opens-spec.js']
		//specs: ['basics-billingschema-all-mains-selectable-spec.js']
		//specs: ['basics-billingschema-check-layout-editor-spec.js']
		//specs: ['basics-billingschema-check-open-all-container-spec.js']
		//specs: ['basics-billingschema-create-delete-in-sub-container-spec.js']
		specs: ['basics-billingschema-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();