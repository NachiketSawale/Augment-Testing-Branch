(function () {
	'use strict';

	// --------------------------------------------------------
	// Resource maintenance module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Maintenance',
		url: 'maintenance',
		mainEntity: 'Maintenance Scheme',
		mainEntities: 'Maintenance Schemes',
		tile: 'resource.maintenance',
		desktop: 'desktopcfg',
		container: [{
			uid: '3218a6cca2b4415ea455785bbe633285',
			permission: '3218a6cca2b4415ea455785bbe633285',
			name: 'Maintenance Schemes',
			dependent: [{
				uid: '7f8efe8f35b34937aaf023d76ae30172',
				permission: '3218a6cca2b4415ea455785bbe633285',
				name: 'Maintenance Scheme Details',
				dependent: []
			},{
				uid: '1dad2033d1b24f4bac55849d549b9c52',
				permission: '1dad2033d1b24f4bac55849d549b9c52',
				name: 'Maintenance Records',
				dependent: [{
					uid: '03987f82b6b141f8b4481c4f52697c83',
					permission: '1dad2033d1b24f4bac55849d549b9c52',
					name: 'Maintenance Record Details',
					dependent: []
				}]
			},{
				uid: 'ef8504d1ed1647aaa47c2672a940010d',
				permission: 'ef8504d1ed1647aaa47c2672a940010d',
				name: 'Translation',
				dependent: []
			}]
		}],
		forceLoad: false,
		mainRecords: 0
	});
})();