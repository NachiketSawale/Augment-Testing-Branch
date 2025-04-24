(function(){
	'use strict';

	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;
	
	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'configuration',
		url: 'configuration',
		internalName: 'productionplanning.configuration',
		mainEntity: 'configuration',
		mainEntities: 'configurations',
		tile: 'productionplanning.configuration',
		desktop: 'desktopcfg',
		container: [{
			uid: '2ad95d69c3b546428e425cb5f2d1a48a',
			permission: '2ad95d69c3b546428e425cb5f2d1a48a',
			name: 'Configuration List',
			dependent: [{
				uid: 'ba21f131ad6942aca156f453793ce867',
				permission: '2ad95d69c3b546428e425cb5f2d1a48a',
				name: 'Configuration Detail',
				dependent: []
			}, {
				uid: '1c25ab6bb66947b5b1303df7b608971b',
				permission: '1c25ab6bb66947b5b1303df7b608971b',
				name: 'EventType2ResourceType List',
				dependent: [{
					uid: 'ac4a4d7a57cd47f0a6f03e3c30de60fe',
					permission: '1c25ab6bb66947b5b1303df7b608971b',
					name: 'EventType2ResourceType Detail',
					dependent: []
				}]
			}, {
				uid: '40ad0cb374dd490f8abbceeccc89ac06',
				permission: '40ad0cb374dd490f8abbceeccc89ac06',
				name: 'EngType List',
				dependent: [{
					uid: 'c9cb4cbaf3c44b6c98f01e943dd6d5d7',
					permission: '40ad0cb374dd490f8abbceeccc89ac06',
					name: 'EngType Detail',
					dependent: []
				}, {
					uid: '3c86eab96195490dae758aded1f0525b',
					permission: '3c86eab96195490dae758aded1f0525b',
					name: 'EngType2EventType List',
					dependent: []
				}]
			}, {
				uid: '396a5945753b4ad7b1787bac084ed427',
				name: 'Translate',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 10
	});
})();
