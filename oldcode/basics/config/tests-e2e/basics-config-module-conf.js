(function () {
	'use strict';

	// --------------------------------------------------------
	// Basics config module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Config',
		url: 'config',
		mainEntity: 'Module',
		mainEntities: 'Modules',
		tile: 'basics-config',
		desktop: 'desktopcfg',
		forceLoad: true,
		mainRecords: 10,
		container: [{
			uid: 'f2c8a4e8330946069c54ee75a4f40db1',
			permission: 'f2c8a4e8330946069c54ee75a4f40db1',
			name: 'Modules',
			dependent: [{
				uid: 'ece7368917db45a3865fe3b2fafbb3ec',
				permission: 'ece7368917db45a3865fe3b2fafbb3ec',
				name: 'Tabs',
				dependent: []
			},{
				uid: 'a7ab957df5c5442c9fb44512d0dad2ce',
				permission: 'a7ab957df5c5442c9fb44512d0dad2ce',
				name: 'Translation',
				dependent: []
			},{
				uid: '04825f8e8f24445ca2a49fd140daafff',
				permission: '04825f8e8f24445ca2a49fd140daafff',
				name: 'Report Groups',
				dependent: [{
					uid: '81340775ba344a6f98b60ec9403460bf',
					permission: '04825f8e8f24445ca2a49fd140daafff',
					name: 'Report Group Details',
					dependent: []
				}]
			}]
		}]
	});
})();