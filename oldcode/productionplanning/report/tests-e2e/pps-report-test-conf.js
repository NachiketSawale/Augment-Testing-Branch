(function() {
	'use strict';

	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		specs: ['pps-report-base-spec.js'],
		allScriptsTimeout: 600000
		//specs: ['*-spec.js']
	});
})();