(function () {
	'use strict';

	// --------------------------------------------------------
	// Resource wot module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Wot',
		url: 'wot',
		mainEntity: 'Work Operation Type',
		mainEntities: 'Work Operation Types',
		tile: 'resource.wot',
		desktop: 'desktopcfg',
		container: [{
			uid: '5c10bdee259d4d9d87fd84a396183093',
			permission: '5c10bdee259d4d9d87fd84a396183093',
			name: 'Work Operation Types',
			dependent: [{
				uid: '8c9b09fc5ce34a468e28cfaa40ece637',
				permission: '5c10bdee259d4d9d87fd84a396183093',
				name: 'Work Operation Type Details',
				dependent: []
			},{
				uid: '8bf3d2a2d03a4ae99aab2ad090c77a53',
				permission: '8bf3d2a2d03a4ae99aab2ad090c77a53',
				name: 'Plant Types',
				dependent: [{
					uid: '84f1b6d1a8d44840a5c13965dd32e411',
					permission: '8bf3d2a2d03a4ae99aab2ad090c77a53',
					name: 'Plant Type Details',
					dependent: []
				}]
			},{
				uid: 'e7696f8f1fcf41fb90c31d5470a21bd8',
				permission: 'e7696f8f1fcf41fb90c31d5470a21bd8',
				name: 'Translation',
				dependent: []
			}]
		}],
		forceLoad: false,
		mainRecords: 0
	});
})();