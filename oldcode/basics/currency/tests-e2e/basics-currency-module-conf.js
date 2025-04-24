(function () {
	'use strict';

	// --------------------------------------------------------
	// Basics currency module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Currency',
		url: 'currency',
		internalName: 'basics.currency',
		mainEntity: 'Currency',
		mainEntities: 'Currencies',
		tile: 'basics.currency',
		desktop: 'desktopcfg',
		container: [{
			uid: '125895cc6f2e11e4b116123b93f75cba',
			permission: '125895cc6f2e11e4b116123b93f75cba',
			name: 'Home Currencies',
			dependent: [{
				uid: '1151f532821247d1aeb031ae87df515c',
				permission: '125895cc6f2e11e4b116123b93f75cba',
				name: 'Home Currency Details',
				dependent: []
			},{
				uid: '674b21f399c4441f89c28ebc12995341',
				permission: '674b21f399c4441f89c28ebc12995341',
				name: 'Currency Conversions',
				dependent: []
			},{
				uid: '5ca9addb22d7457c877e4bc7ae38ee7c',
				permission: '5ca9addb22d7457c877e4bc7ae38ee7c',
				name: 'Exchange Rates',
				dependent: []
			},{
				uid: '66ed1e3c6f2e11e4b116123b93f75cba',
				permission: '66ed1e3c6f2e11e4b116123b93f75cba',
				name: 'Currency Translation',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 5
	});
})();
