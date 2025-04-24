(function() {
	'use strict';

	// --------------------------------------------------------
	// Resource componenttype module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Project Resources',
		url: 'project',
		internalName: 'resource.project',
		mainEntity: 'Project',
		mainEntities: 'Projects',
		tile: 'resource.project',
		desktop: 'desktop',
		container: [{
			uid: '93a0b617befc42e5bd09df407abb2e17',
			permission: '713b7d2a532b43948197621ba89ad67a',
			name: 'Projects',
			dependent: [{
				uid: '6859a6fb2e9346e9a4d9f4ec3c212052',
				permission: '713b7d2a532b43948197621ba89ad67a',
				name: 'Project Details',
				dependent: []
			},
			{
				uid: '3f8ecb61a9ee42b1af851af3b55fcd4b',
				permission: '6540965b6c84450aa1da41fd1c870a47',
				name: 'Planning Board',
				dependent: []
			}
			]
		}],
		forceLoad: true,
		mainRecords: 5
	});
})();
