(function () {
	'use strict';

	// --------------------------------------------------------
	// Logistic dispatching module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Sundry Service',
		url: 'sundryservice',
		internalName: 'logistic.sundryservice',
		mainEntity: 'Sundry Service',
		mainEntities: 'Sundry Service',
		tile: 'logistic.sundryservice',
		desktop: 'desktopcfg',
		container: [{
			uid: '3c3df5cc678f4ee4a2184555c39854c3',
			permission: '3c3df5cc678f4ee4a2184555c39854c3',
			name: 'Sundry Services',
			dependent: [{
					uid: '3e8ef5f3b7c741f486e60dd2bb1c564c',
					permission: '3c3df5cc678f4ee4a2184555c39854c3',
					name: 'Sundry Service Details',
					dependent: []
				},
				{
					uid: '014f9eb6e9cc4d8089bf7b7e1173d677',
					permission: '014f9eb6e9cc4d8089bf7b7e1173d677',
					name: 'Sundry Service Price Lists',
					dependent: [{
						uid: '1f0839eeedb741cc9cbeb6f00266c6f8',
						permission: '014f9eb6e9cc4d8089bf7b7e1173d677',
						name: 'Sundry Service Price List Details',
						dependent: []
					}]
				},{
					uid: '7c1e6b7291304cd3a95630b39c4a7f6d',
					permission: '7c1e6b7291304cd3a95630b39c4a7f6d',
					name: 'Translation',
					dependent: []
				}
			]
		}],
		forceLoad: true,
		sidebarFilter: 'E2E-',
		mainRecords: 2
	});
})();
