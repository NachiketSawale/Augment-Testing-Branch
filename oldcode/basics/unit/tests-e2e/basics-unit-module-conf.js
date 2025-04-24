(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics unit module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Unit',
		url: 'unit',
		internalName: 'basics.unit',
		mainEntity: 'Unit',
		mainEntities: 'Units',
		tile: 'basics.unit',
		desktop: 'desktopcfg',
		container: [{
			uid: '438973c14ead47d3a651742bbc9b5696',
			permission: '438973C14EAD47D3A651742BBC9B5696',
			name: 'Units',
			dependent: [{
				uid: 'a68d72f3d8b74a4a9dd677738a79ebaa',
				permission: '438973C14EAD47D3A651742BBC9B5696',
				name: 'Unit Details',
				dependent: []
			},
			{
				uid: '92cd68efde7247aab4f955c125ef8ecb',
				permission: '92CD68EFDE7247AAB4F955C125EF8ECB',
				name: 'Synonyms',
				dependent: [{
					uid: '7b3e7aceb29d4edc9b0f7b4f02f73581',
					permission: '92CD68EFDE7247AAB4F955C125EF8ECB',
					name: 'Synonym Details',
					dependent: []
				}]
			},
			{
				uid: '7b3e7aceb29d4edc8b0f7b4f02f73585',
				permission: '7B3E7ACEB29D4EDC8B0F7B4F02F73585',
				name: 'Translation',
				dependent: []
			}
			]
		}],
		forceLoad: true,
		mainRecords: 30
	});
})();
