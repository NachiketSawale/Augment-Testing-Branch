(function() {
	'use strict';

	// --------------------------------------------------------
	// Scheduling templategroup module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Templategroup',
		url: 'templategroup',
		internalName: 'scheduling.templategroup',
		mainEntity: 'Template Group',
		mainEntities: 'Template Groups',
		tile: 'scheduling.templategroup',
		desktop: 'desktopcfg',
		container: [{
			uid: '59e580ecab1f42608b3ab858dcbc22b0',
			permission: '59E580ECAB1F42608B3AB858DCBC22B0',
			name: 'Template Groups',
			dependent: [{
				uid: '9f6bdd0c5b51423ca2bca64fe103187c',
				permission: '59E580ECAB1F42608B3AB858DCBC22B0',
				name: 'Template Group Details',
				dependent: []
			},
			{
				uid: '038baa2dc7a94e56900b1c3f21ffc7af',
				permission: '038BAA2DC7A94E56900B1C3F21FFC7AF',
				name: 'Group 2 Controlling Units',
				dependent: [{
					uid: '54259d07f8cc42c7ad5b3cd44d39e3e1',
					permission: '038BAA2DC7A94E56900B1C3F21FFC7AF',
					name: 'Group 2 Controlling Unit Details',
					dependent: []
				}]
			},
			{
				uid: '05ef403d694a46e3b23307821779748b',
				permission: '05EF403D694A46E3B23307821779748B',
				name: 'Translation',
				dependent: []
			}
			]
		}],
		forceLoad: true,
		sidebarFilter: 'E2E-',
		mainRecords: 5
	});
})();
