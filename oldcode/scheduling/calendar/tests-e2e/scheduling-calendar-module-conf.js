(function () {
	'use strict';

	// --------------------------------------------------------
	// Scheduling calendar module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Calendar',
		url: 'calendar',
		internalName: 'scheduling.calendar',
		mainEntity: 'Calendar',
		mainEntities: 'Calendars',
		tile: 'scheduling.calendar',
		desktop: 'desktopcfg',
		container: [{
			uid: 'afecdb4a08404395855258b70652d04b',
			permission: 'AFECDB4A08404395855258B70652D04B',
			name: 'Calendars',
			dependent: [{
				uid: '506fc12756f8439e8fecb7ee4b360538',
				name: 'Calendar Details',
				permission: 'AFECDB4A08404395855258B70652D04B',
				dependent: []
			},
			{
				uid: '4196114c284b49efac5b4431bf9836b2',
				name: 'Weekdays',
				noCreateDelete: true,
				permission: '4196114C284B49EFAC5B4431BF9836B2',
				dependent: [{
					uid: '4196114c284b49efac5b4431bf9836b4',
					name: 'Weekday Details',
					permission: '4196114C284B49EFAC5B4431BF9836B2',
					dependent: []
				}]
			},
			{
				uid: '50d82415e24c47aca182c0f634ee9515',
				name: 'Workhours',
				permission: '50D82415E24C47ACA182C0F634EE9515',
				dependent: [{
					uid: '50d82415e24c47aca182c0f634ee9520',
					name: 'Workhour Details',
					permission: '50D82415E24C47ACA182C0F634EE9515',
					dependent: []
				}]
			},
			{
				name: 'Exceptions',
				uid: '3159c0a0c6d34287bf80fa1398f879ec',
				permission: '3159C0A0C6D34287BF80FA1398F879EC',
				dependent: [{
					uid: '3978757e36bc49cba7e8a177272f2bfc',
					name: 'Exception Details',
					permission: '3159C0A0C6D34287BF80FA1398F879EC',
					dependent: []
				}]
			}
			]
		}],
		forceLoad: true,
		mainRecords: 10
	});
})();

