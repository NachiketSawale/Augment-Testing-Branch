(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics country module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Country',
		url: 'country',
		internalName: 'basics.country',
		mainEntity: 'Country',
		mainEntities: 'Countries',
		tile: 'basics.country',
		desktop: 'desktopcfg',
		container: [{
			uid: '84ac7a2a178e4ea6b6dba23ab5f04aa9',
			name: 'Countries',
			permission: '84ac7a2a178e4ea6b6dba23ab5f04aa9',
			dependent: [ {
				uid: 'cd1fc59aa30149c487bedcfc38704ab5',
				name: 'Country Details',
				permission: '84ac7a2a178e4ea6b6dba23ab5f04aa9',
				dependent: []
			},{
				uid: '8a1744845b1c4107b6a16559df69bdab',
				name: 'States',
				permission: '8a1744845b1c4107b6a16559df69bdab',
				dependent: [{
					uid: '5860289e7cd04a8ebddfadf892e11870',
					name: 'State Details',
					permission: '8a1744845b1c4107b6a16559df69bdab',
					dependent: []
				}]
			},
			{
				uid: 'e75d60f19d744348bb7e6d56002d83b9',
				name: 'Translation',
				permission: 'e75d60f19d744348bb7e6d56002d83b9',
				dependent: []
			}
			]
		}],
		forceLoad: true,
		mainRecords: 60 //ignore the rest, we should have some entities with children.
	});
})();
