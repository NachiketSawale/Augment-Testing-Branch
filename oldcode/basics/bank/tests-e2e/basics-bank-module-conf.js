(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics bank module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Bank',
		url: 'bank',
		internalName: 'basics.bank',
		mainEntity: 'Bank',
		mainEntities: 'Banks',
		tile: 'basics-bank',
		desktop: 'desktopcfg',
		container: [{
			uid: 'c33e512fee614bda84485f33093472f7',
			permission: 'C33E512FEE614BDA84485F33093472F7',
			name: 'Banks',
			dependent: [{
				uid: '31d65ad2dc274a26ae91281b8d71a009',
				permission: 'C33E512FEE614BDA84485F33093472F7',
				name: 'Bank Details',
				dependent: []
			}]
		}],
		forceLoad: false,
		mainRecords: 0
	});
})();
