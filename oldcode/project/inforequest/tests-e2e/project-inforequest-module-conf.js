(function() {
	'use strict';

	// project-inforequest module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Request for Information',
		url: 'inforequest',
		internalName: 'project.inforequest',
		mainEntity: 'Request',
		mainEntities: 'Requests',
		tile: 'project.inforequest',
		desktop: 'desktop',
		forceLoad: true,
		sidebarFilter: 'E2E-',
		mainRecords: 2,
		forcePinning: true,
		container: [{
			uid: '281de48b068c443c9b7c62a7f51ac45f',
			permission: '281de48b068c443c9b7c62a7f51ac45f',
			name: 'Requests',
			dependent: [{
				uid: '8b9c47c94f0b4077beaaab998c399048',
				name: 'Request Details',
				permission: '281de48b068c443c9b7c62a7f51ac45f',
				dependent: []
			},
			{
				uid: '65becece765a419099b148c803a116f5',
				name: 'Contributions',
				permission: '65becece765a419099b148c803a116f5',
				dependent: []
			},
			{
				uid: '55f24a16454c4b8ab9fbf2e4fe2e90e6',
				permission: '55f24a16454c4b8ab9fbf2e4fe2e90e6',
				name: 'Relevant Tos',
				dependent: [{
					uid: 'a5779e8fa1d543febfdf92832d44a9e8',
					name: 'Relevant To Details',
					permission: '55f24a16454c4b8ab9fbf2e4fe2e90e6',
					dependent: []
				}]
			},
			{
				uid: 'bb1fddaed89d46c2b674fe612e1321c3',
				name: 'Hoops Viewer 1',
				permission: '7ac2a568c32e4a16a2b4106db572133d',
				dependent: []
			},
			{
				uid: 'f76c791a7c874e0ea53dc395a1b5a3d1',
				name: 'Hoops Viewer 2',
				permission: '9275c055a1e14f82a37831cd0f68c40f',
				dependent: []
			},
			{
				uid: '726cdbd5379541ebaebce29f5b2a2499',
				name: 'Hoops Viewer 3',
				permission: 'a272cac0ae67421eb9976bf6392f80a7',
				dependent: []
			},
			{
				uid: '85ddf15bb095446a93aa1ff7feb77b99',
				name: 'Hoops Viewer 4',
				permission: '097de59303a8453680bdc61d350365fd',
				dependent: []
			},
			{
				uid: '8fe0f95ab4904222868c511759c3267b',
				name: 'Camera Positions',
				permission: '17c46d111cd44732827332315ea206ed',
				dependent: []
			},
			{
				uid: 'da5481eabd71482dbca12c4260eec5bf',
				name: 'Model Object Infos',
				permission: '36abc91df46f4129a78cc26fe79a6fdc',
				noCreateDelete: true,
				dependent: [{
					uid: '086b1d0b9d4e4bc6a80ffddaa668ada7',
					name: 'Model Object Info Details',
					permission: '36abc91df46f4129a78cc26fe79a6fdc',
					dependent: []
				}]
			}
			]
		}
		]
	});
})();
