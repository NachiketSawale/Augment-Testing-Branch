/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function() {
	'use strict';

	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports.config = iTwo40E2EConfigurator.createBaseTestConfiguration({
		specs: [
			//'model-administration-tile-exists-spec.js',
			//'model-administration-module-opens-spec.js',
			//'model-administration-check-layout-editor-spec.js',
			//'model-administration-check-open-all-container-spec.js',
			'*-spec.js'
		]
	});
})();