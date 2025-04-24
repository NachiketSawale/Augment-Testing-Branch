(function () {
	'use strict';
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		//specs: ['logistic-cardtemplate-tile-exists-spec.js']
		//specs: ['logistic-cardtemplate-module-opens-spec.js']
		//specs: ['logistic-cardtemplate-all-mains-selectable-spec.js']
		//specs: ['logistic-cardtemplate-check-layout-editor-spec.js']
		specs: ['logistic-cardtemplate-check-open-all-container-spec.js']
		//specs: ['logistic-cardtemplate-create-delete-in-sub-container-spec.js']
		//specs: ['logistic-cardtemplate-create-delete-in-root-container-spec.js']
		//specs: ['*-spec.js']
	});
})();