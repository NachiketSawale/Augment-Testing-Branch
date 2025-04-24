(function () {
	'use strict';

	var _ = require('lodash');
	var assistance = {moduleConfig: require('./productionplanning-engineering-module-conf.js')};
	var configurator = require('rib-itwo40-e2e').configurator;

	_.each(configurator.provideBaseSpecs(assistance), function (spec) {
		require(spec);
	});
})();