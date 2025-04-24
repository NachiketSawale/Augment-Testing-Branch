(function() {
	'use strict';

	// --------------------------------------------------------
	// Resource componenttype module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Enterprise Resources',
		url: 'enterprise',
		internalName: 'resource.enterprise',
		mainEntity: 'Dispatcher Group',
		mainEntities: 'Dispatcher Groups',
		tile: 'resource.enterprise',
		desktop: 'desktop',
		container: [{
			uid: 'b4cb333f09d448ab9a9dde5409bce51b',
			permission: 'b4cb333f09d448ab9a9dde5409bce51b',
			name: 'Dispatcher Groups',
			dependent: [{
				uid: 'ba8822186d5f4a8cae3268ccdec8729f',
				permission: 'b4cb333f09d448ab9a9dde5409bce51b',
				name: 'Dispatcher Group Details',
				dependent: []
			},
			{
				uid: 'f36034eeab0b465da740bc58f683b40d',
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
