(function() {
	/* global module require */
	'use strict';

	// --------------------------------------------------------
	// Scheduling template module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Template',
		url: 'template',
		internalName: 'scheduling.template',
		mainEntity: 'Template',
		mainEntities: 'Templates',
		tile: 'scheduling-template',
		desktop: 'desktopcfg',
		container: [{
			uid: 'afecde4a08404395855258b70652d04c',
			permission: 'AFECDE4A08404395855258B70652D04C',
			name: 'Template Groups',
			dependent: [{
				uid: 'afecde4a08404395855258b70652f060',
				permission: 'AFECDE4A08404395855258B70652D04C',
				name: 'Template Group Details'
			},
			{
				uid: 'afecde4a08404395855258b70652d04d',
				permission: 'AFECDE4A08404395855258B70652D04D',
				name: 'Templates',
				dependent: [{
					uid: 'afecde4a08404395855258b70652d060',
					permission: 'AFECDE4A08404395855258B70652D04D',
					name: 'Template Details'
				},
				{
					uid: 'afecde4a08404395855258b70652d04e',
					permission: 'AFECDE4A08404395855258B70652D04E',
					name: 'Event Templates',
					dependent: [{
						uid: 'afecde4a08404395855258b70652d070',
						permission: 'AFECDE4A08404395855258B70652D04E',
						name: 'Event Template Details'
					}]
				},
				{
					uid: 'afecde4a08404395855258b70652d050',
					permission: 'AFECDE4A08404395855258B70652D050',
					name: 'Template 2 Controlling Units',
					dependent: [{
						uid: 'afecde4a08404395855258b70652d080',
						permission: 'AFECDE4A08404395855258B70652D050',
						name: 'Template 2 Controlling Unit Details'
					}]
				},
				{
					uid: 'a7f6eea9117c4f72bb73f88709f6583d',
					permission: 'a7f6eea9117c4f72bb73f88709f6583d',
					name: 'Performance Rules',
					dependent: [{
						uid: '8cbbced1a6e142d095f19e0387af0664',
						permission: 'a7f6eea9117c4f72bb73f88709f6583d',
						name: 'Performance Rule Details'
					}]
				},
				{
					uid: 'a7f6eea9117c4f72bb73f88709f6583d',
					permission: 'A7F6EEA9117C4F72BB73F88709F6583D',
					name: 'Activity Criteria',
					dependent: [{
						uid: '8cbbced1a6e142d095f19e0387af0664',
						permission: 'A7F6EEA9117C4F72BB73F88709F6583D',
						name: 'Activity Criterium Details'
					}]
				},
				{
					uid: '8724f845940c46c4b2767ad4109b345d',
					permission: '8724f845940c46c4b2767ad4109b345d',
					name: 'Characteristics',
					dependent: []
				},
				{
					uid: '5e5a1cf157e54d799aff00d4d747bbd2',
					permission: '5E5A1CF157E54D799AFF00D4D747BBD2',
					name: 'Translation',
					dependent: []
				}
				]
			}
			]
		}],
		forceLoad: true,
		sidebarFilter: 'E2E-',
		mainRecords: 4
	});
})();
