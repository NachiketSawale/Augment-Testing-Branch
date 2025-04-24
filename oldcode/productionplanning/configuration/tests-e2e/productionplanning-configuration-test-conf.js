(function() {
	'use strict';

	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		specs: ['productionplanning-configuration-base-spec.js']
		//specs: ['*-spec.js']
	});
})();