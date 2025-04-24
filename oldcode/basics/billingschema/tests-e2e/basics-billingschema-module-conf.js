(function () {
	'use strict';

	// --------------------------------------------------------
	// Basics billingschema module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Billingschema',
		url: 'billingschema',
		mainEntity: 'Billing Schema',
		mainEntities: 'Billing Schemas',
		tile: 'basics.billingschema',
		desktop: 'desktopcfg',
		forceLoad: true,
		mainRecords: 5,
		container: [{
			uid: '0de5c7c7d34d45a7a0eb39172fbd3796',
			permission: '0de5c7c7d34d45a7a0eb39172fbd3796',
			name: 'Billing Schemas',
			dependent: [{
				uid: '5d010ae2cb5e4c96bc77da8044069022',
				permission: '0de5c7c7d34d45a7a0eb39172fbd3796',
				name: 'Billing Schema Detail',
				dependent: []
			},{
				uid: 'ccea3f4f554c4892b4de13f702dcc47d',
				permission: 'ccea3f4f554c4892b4de13f702dcc47d',
				name: 'Remarks',
				dependent: []
			},{
				uid: 'ccea3f4f554c4892b4de13f702dcc47d',
				permission: 'ccea3f4f554c4892b4de13f702dcc47d',
				name: 'Billing Schema Details',
				dependent: []
			},{
				uid: '8a2267364c8147d68c38553a8652aed4',
				permission: '8a2267364c8147d68c38553a8652aed4',
				name: 'Translation',
				dependent: []
			}]
		}]
	});
})();