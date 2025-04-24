(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics payment module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Payment',
		url: 'payment',
		internalName: 'basics.payment',
		mainEntity: 'Payment',
		mainEntities: 'Payments',
		tile: 'project-payment',
		desktop: 'desktopcfg',
		container: [{
			uid: '24790afafd35416595ef14527d0ba021',
			permission: '24790afafd35416595ef14527d0ba021',
			name: 'Payments',
			dependent: [{
				uid: '997d0546dca4406dae95ab214aae9d0d',
				permission: '24790afafd35416595ef14527d0ba021',
				name: 'Payment Details',
				dependent: []
			},
			{
				uid: '162414311ae94f1a9e0d92d9ff731ec1',
				permission: '162414311ae94f1a9e0d92d9ff731ec1',
				name: 'Translation',
				dependent: []
			}]
		}
		],
		forceLoad: true,
		mainRecords: 10
	});
})();
