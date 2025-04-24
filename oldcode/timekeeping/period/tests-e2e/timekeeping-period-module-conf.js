(function () {
	/* global require module */
	'use strict';

	// --------------------------------------------------------
	// Timekeeping period module configuration
	const iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Period',
		url: 'period',
		mainEntity: 'Period',
		mainEntities: 'Periods',
		tile: 'timekeeping.period',
		desktop: 'desktopcfg',
		container: [{
			uid: '7d9965a4006c4a9fac97f8514baf6b4d',
			permission: '7d9965a4006c4a9fac97f8514baf6b4d',
			name: 'Periods',
			dependent: [{
				uid: '670b62e97f124e208db778cb7135220a',
				permission: '7d9965a4006c4a9fac97f8514baf6b4d',
				name: 'Period Details',
				dependent: []
			},{
				uid: '31e3362580964f09a27a7e1bb35acfa6',
				permission: '31e3362580964f09a27a7e1bb35acfa6',
				name: 'Translation',
				dependent: []
			}]
		}],
		forceLoad: false,
		mainRecords: 0
	});
})();