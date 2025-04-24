(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics unit module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Workflow Administration',
		url: 'workflowAdministration',
		internalName: 'basics.workflowadministration',
		mainEntity: 'Workflow Instance',
		mainEntities: 'Workflow Instance',
		tile: 'basics.workflowAdministration',
		desktop: 'desktopcfg',
		container: [{
			uid: '3a38f0e839e811e5a151feff819cdc9f',
			permission: '3a38f0e839e811e5a151feff819cdc9f',
			name: 'Workflow Instance',
			dependent: [{
				uid: 'bb214b5c3a7d11e5a151feff819cdc9f',
				permission: '8041286797b04f35aa920b4f6442989c',
				name: 'Instance Context',
				dependent: []
			},
			{
				uid: '59bfb75bb4624c40bd52dd8ce4e42c98',
				permission: '3a38f0e839e811e5a151feff819cdc9f',
				noCreateDelete: true,
				name: 'Action Instance',
				dependent: [{
					uid: '612085cc72fb4a9ca3ec9dba7b97db36',
					permission: 'bb214b5c3a7d11e5a151feff819cdc9f',
					name: 'Action Instance Context',
					dependent: []
				}]
			},
			{
				uid: '1973fe93e26245a39a048eacc630b81a',
				permission: '3a38f0e839e811e5a151feff819cdc9f',
				name: 'Client Action',
				dependent: []
			}
			]
		}],
		forceLoad: false,
		mainRecords: 0
	});
})();
