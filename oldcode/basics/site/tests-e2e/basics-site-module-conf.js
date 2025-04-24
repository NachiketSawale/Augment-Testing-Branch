(function () {
	'use strict';

	// --------------------------------------------------------
	// Basics sites module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Sites',
		url: 'site',
		internalName: 'basics.site',
		mainEntity: 'Site',
		mainEntities: 'Sites',
		tile: 'basics.site',
		desktop: 'desktopcfg',
		container: [{
			uid: 'd7d2e8cf9d9b47999e7a391ead0d3e00',
			permission: 'd7d2e8cf9d9b47999e7a391ead0d3e00',
			name: 'Sites',
			dependent: [{
				uid: 'a34485a41a6d4de6810f5198ac3e2459',
				permission: 'd7d2e8cf9d9b47999e7a391ead0d3e00',
				name: 'Sites',
				dependent: []
			},
			{
				uid: 'e40fdef629324924a71ad7fe16ad11ab',
				permission: 'e40fdef629324924a71ad7fe16ad11ab',
				name: 'Translation',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 10
	});
})();
