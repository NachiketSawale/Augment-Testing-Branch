(function () {
	'use strict';

	// --------------------------------------------------------
	// Basics characteristic module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Characteristic',
		url: 'characteristic',
		mainEntity: 'Characteristic Group',
		mainEntities: 'Characteristic Groups',
		tile: 'characteristics',
		desktop: 'desktopcfg',
		container: [{
			uid: '5e5cfb298fff4205adab8fb696ac91ec',
			permission: '5e5cfb298fff4205adab8fb696ac91ec',
			name: 'Characteristic Groups',
			dependent: [{
				uid: '7f2dd4cca7284d4b9870e1ab25f21534',
				permission: '5e5cfb298fff4205adab8fb696ac91ec',
				name: 'Characteristic Group Details',
				dependent: []
			},{
				uid: '49cb8879815b4be88c8d6ede1eb52ad0',
				permission: '49cb8879815b4be88c8d6ede1eb52ad0',
				name: 'Characteristic Sections',
				noCreateDelete: true,
				dependent: [{
					uid: '0d48f09cf87a496ca0a1766819dd62e7',
					permission: '49cb8879815b4be88c8d6ede1eb52ad0',
					name: 'Characteristic Section Details',
					dependent: []
				}]
			},{
				uid: '2565a90a68984456bb7a62d701271a9f',
				permission: '2565a90a68984456bb7a62d701271a9f',
				name: 'Characteristics',
				dependent: [{
					uid: 'a5f523f960624768ae9e31a28e378dc8',
					permission: '2565a90a68984456bb7a62d701271a9f',
					name: 'Characteristic Details',
					dependent: []
				},{
					uid: 'cf5649d049f44340b93768232e4a911e',
					permission: 'cf5649d049f44340b93768232e4a911e',
					name: 'Discrete Values',
					dependent: [{
						uid: '11fdd68f0d3948749fdf3ac6f1972401',
						permission: 'cf5649d049f44340b93768232e4a911e',
						name: 'Discrete Value Details',
						dependent: []
					}]
				}]
			},{
				uid: '0dffafd00dbd4df7a6f82cf507a9376c',
				permission: '0dffafd00dbd4df7a6f82cf507a9376c',
				name: 'Remark',
				dependent: []
			},{
				uid: '4307455a185a4d1d84da91ecec793ebb',
				permission: '4307455a185a4d1d84da91ecec793ebb',
				name: 'Used In Company',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 2
	});
})();