(function () {
	'use strict';

	// --------------------------------------------------------
	// Timekeeping time module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Time Symbols',
		url: 'timesymbols',
		internalName: 'timekeeping.timesymbols',
		mainEntity: 'Time Symbol',
		mainEntities: 'Time Symbols',
		tile: 'timekeeping.timesymbols',
		desktop: 'desktopcfg',
		container: [{
			uid: '4e5bc29fd0a3407b8f2e7c0c224b578c',
			permission: '4e5bc29fd0a3407b8f2e7c0c224b578c',
			name: 'Time Symbols',
			dependent: [{
				uid: '9d1103ff3dfb42ceae45f0991605761c',
				permission: '4e5bc29fd0a3407b8f2e7c0c224b578c',
				name: 'Time Symbol Details',
				dependent: []
			}, {
				uid: '308ed008e88d440eaf3e5b81c96b8d26',
				permission: '308ed008e88d440eaf3e5b81c96b8d26',
				name: 'Translation',
				dependent: []
			}]
		}],
		forceLoad: false,
		mainRecords: 0
	});
})();