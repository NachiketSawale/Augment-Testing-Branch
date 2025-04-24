(function() {
	'use strict';

	// --------------------------------------------------------
	// Resource reservation module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Reservation',
		url: 'reservation',
		internalName: 'resource.reservation',
		mainEntity: 'Reservation',
		mainEntities: 'Reservations',
		tile: 'resource.reservation',
		desktop: 'desktop',
		container: [{
			uid: '6540965b6c84450aa1da41fd1c870a47',
			permission: '6540965b6c84450aa1da41fd1c870a47',
			name: 'Reservations',
			dependent: [{
				uid: 'f1c290f9673c4ed2af8893510f93f6a5',
				permission: '6540965b6c84450aa1da41fd1c870a47',
				name: 'Reservation Details',
				dependent: []
			},
			{
				uid: 'b1436d024b4b4ca592e58c8ea34384a7',
				permission: 'b1436d024b4b4ca592e58c8ea34384a7',
				name: 'Planning Board',
				dependent: []
			}]
		}],
		forceLoad: false,
		mainRecords: 0
	});
})();
