/* global module, require */
(function () {
	'use strict';

	// --------------------------------------------------------
	// Schedling main module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Scheduling',
		url: 'main',
		internalName: 'scheduling.main',
		mainEntity: 'Activity',
		mainEntities: 'Activities',
		tile: 'scheduling.main',
		desktop: 'desktop',
		forceLoad: true,
		sidebarFilter: 'E2E-',
		mainRecords: 4,
		forcePinning: true,
		headerContainerUuidProject: '7447b8df191c45118f56dd84d25d1b41',
		container: [{
			name: 'Activity Structure',
			uid: '0fcbaf8c89ac4493b58695cfa9f104e2',
			noCreateDelete: true,
			permission: '0fcbaf8c89ac4493b58695cfa9f104e2',
			dependent: [{
				uid: '0b1f0e40da664e4a8081fe8fa6111403',
				name: 'Activity Details',
				permission: '13120439D96C47369C5C24A2DF29238D',
				dependent: []
			},
			{
				name: 'Line of Balance',
				uid: '5eb1a96fefdf49c4b47ca21ba14ba2b0',
				permission: '5eb1a96fefdf49c4b47ca21ba14ba2b0',
				dependent: []
			},
			{
				name: 'Activities Flat',
				uid: '13120439d96c47369c5c24a2df29238d',
				permission: '13120439d96c47369c5c24a2df29238d',
				dependent: []
			},
			{
				name: 'Relationships',
				uid: 'd8fe0df4c85241048abea198a699595a',
				permission: 'd8fe0df4c85241048abea198a699595a',
				dependent: [{
					name: 'Relationship Details',
					uid: '800651ed2f844b2592e39bea7df6ab69',
					permission: 'd8fe0df4c85241048abea198a699595a',
					dependent: []
				}]
			},
			{
				name: 'Report Method',
				uid: '04cbfbacb07c4fba922a9f2b91206657',
				permission: '04cbfbacb07c4fba922a9f2b91206657',
				dependent: [{
					name: 'Report Method Details',
					uid: '27c823ef3d0a4fe3b38d43957b5c86d6',
					permission: '04cbfbacb07c4fba922a9f2b91206657',
					dependent: []
				}]
			},
			{
				name: 'Clerks',
				uid: 'cdb0ea3d378846ab81bde1020e62f32f',
				permission: 'cdb0ea3d378846ab81bde1020e62f32f',
				dependent: [{
					name: 'Clerk Details',
					uid: '13c7ff9d5fb24b96a2274507fa453422',
					permission: 'cdb0ea3d378846ab81bde1020e62f32f',
					dependent: []
				}]
			},
			{
				name: 'GANTT-Grid',
				uid: '98239ba315374530a1e28ad333c6a7ee',
				permission: '98239ba315374530a1e28ad333c6a7ee',
				dependent: []
			},
			{
				name: 'GANTT-Treegrid',
				uid: '3a1a26c46b9e4e35af5ad60fd2f49679',
				permission: '3a1a26c46b9e4e35af5ad60fd2f49679',
				dependent: []
			},
			{
				name: 'Events',
				uid: '578f759af73e4a6aa22089975d3889ac',
				permission: '578f759af73e4a6aa22089975d3889ac',
				dependent: [{
					name: 'Event Details',
					uid: 'e006376f2dba4a8d97d6bab94f1e36e0',
					permission: '578f759af73e4a6aa22089975d3889ac',
					dependent: []
				}]
			},
			{
				name: 'Characteristics',
				uid: 'c4f6e415194d44d49b995d4f2f4e8a69',
				permission: 'c4f6e415194d44d49b995d4f2f4e8a69',
				dependent: []
			},
			{
				name: 'Baselines',
				uid: 'f6b1110d6e2249a7ba25c8a0d9c27a82',
				permission: 'f6b1110d6e2249a7ba25c8a0d9c27a82',
				noCreateDelete: true,
				dependent: [{
					name: 'Baseline Details',
					uid: '991140e3e8864074821a60ef3d8286a6',
					permission: 'f6b1110d6e2249a7ba25c8a0d9c27a82',
					dependent: []
				}]
			},
			{
				name: 'Activity Baseline Comparison',
				uid: 'de783a504a284f64aba8c473a95d0262',
				permission: '5fc7ccd1f42f4aa7b8b2edeb2bde9d96',
				dependent: [{
					name: 'Activity Baseline Comparison Detail',
					uid: '07901a0ddc2347698eb076c09cf8160d',
					permission: '5fc7ccd1f42f4aa7b8b2edeb2bde9d96',
				}]
			},
			{
				name: 'Line-Item Progress',
				uid: '5c2a4c1d66c5438981aa934f449e1d4d',
				permission: '5c2a4c1d66c5438981aa934f449e1d4d',
				noCreateDelete: true,
				dependent: [{
					name: 'Line-Item Progress Details',
					uid: '7dcaa269ec3f4bac8059b6c2af97bae2',
					permission: '5c2a4c1d66c5438981aa934f449e1d4d',
					dependent: []
				}]
			},
			{
				name: 'Activity Location Matrix',
				uid: '04e41e123ba0489f83b648c2c713ce20',
				permission: '13120439d96c47369c5c24a2df29238d',
				dependent: []
			},
			{
				name: 'Documents Project',
				uid: '4eaa47c530984b87853c6f2e4e4fc67e',
				permission: '4EAA47C530984B87853C6F2E4E4FC67E',
				noCreateDelete: true,
				dependent: [{
					name: 'Document Project Details',
					uid: '8bb802cb31b84625a8848d370142b95c',
					permission: '4EAA47C530984B87853C6F2E4E4FC67E',
					dependent: []
				}]
			},
			{
				name: 'Documents Revision',
				uid: '684f4cdc782b495e9e4be8e4a303d693',
				permission: '684f4cdc782b495e9e4be8e4a303d693',
				noCreateDelete: true,
				dependent: [{
					name: 'Document Revision Details',
					uid: 'ddb6e1e7e8c242eb8d9ff8284cf1edb1',
					permission: '684f4cdc782b495e9e4be8e4a303d693',
					dependent: []
				}]
			},
			{
				name: 'Predecessors',
				uid: 'e4a4e97657ef4068bdf1367afca01375',
				permission: 'e4a4e97657ef4068bdf1367afca01375',
				dependent: [{
					name: 'Predecessor Details',
					uid: 'e65b9fddd0a7404c9cbf6c111e1dac81',
					permission: 'e4a4e97657ef4068bdf1367afca01375',
					dependent: []
				}]
			},
			{
				name: 'Model Hoops 3D Viewer',
				uid: 'bb1fddaed89d46c2b674fe612e1321c3',
				permission: '7ac2a568c32e4a16a2b4106db572133d',
				dependent: []
			},
			{
				name: 'Model Hoops 3D Viewer-2',
				uid: 'f76c791a7c874e0ea53dc395a1b5a3d1',
				permission: '9275c055a1e14f82a37831cd0f68c40f',
				dependent: []
			},
			{
				name: 'Model Hoops 3D Viewer-3',
				uid: '726cdbd5379541ebaebce29f5b2a2499',
				permission: 'a272cac0ae67421eb9976bf6392f80a7',
				dependent: []
			},
			{
				name: 'Model Hoops 3D Viewer-4',
				uid: '85ddf15bb095446a93aa1ff7feb77b99',
				permission: '097de59303a8453680bdc61d350365fd',
				dependent: []
			},
			{
				name: 'Saved Camera Positions',
				uid: '8fe0f95ab4904222868c511759c3267b',
				permission: '17c46d111cd44732827332315ea206ed',
				dependent: []
			},
			{
				name: 'Model Object Info List',
				uid: 'da5481eabd71482dbca12c4260eec5bf',
				permission: '36abc91df46f4129a78cc26fe79a6fdc',
				noCreateDelete: true,
				dependent: [{
					name: 'Model Object Info Details',
					uid: '086b1d0b9d4e4bc6a80ffddaa668ada7',
					permission: '36abc91df46f4129a78cc26fe79a6fdc',
					dependent: []
				}]
			},
			{
				name: 'Simulation Cockpit',
				uid: '447c8cb06ac3490bbb87e744e4373cae',
				permission: 'a919c5302c1a4a8c975726f2466ca52d',
				dependent: []
			},
			{
				name: 'Source Activities',
				uid: '4cbbc13ef72f49808cd693bdca839846',
				permission: '13120439d96c47369c5c24a2df29238d',
				dependent: []
			},
			{
				name: 'Source Activity Templates',
				uid: '026c24f15a944a27980437ab4dc85b58',
				permission: 'afecde4a08404395855258b70652d04d',
				dependent: []
			},
			{
				name: 'Simulation Gantt Chart',
				uid: 'a7482dd41cd44ece9f554d028d7f518f',
				permission: 'a7482dd41cd44ece9f554d028d7f518f',
				dependent: []
			}]
		}]
	});
})();
