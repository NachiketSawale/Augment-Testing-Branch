(function () {
	'use strict';
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['logistic-card-tile-exists-spec.js']
		//specs: ['logistic-card-module-opens-spec.js']
		//specs: ['logistic-card-all-mains-selectable-spec.js']
		//specs: ['logistic-card-check-layout-editor-spec.js']
		specs: ['logistic-card-check-open-all-container-spec.js']
		//specs: ['logistic-card-create-delete-in-sub-container-spec.js']
		//specs: ['logistic-card-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();