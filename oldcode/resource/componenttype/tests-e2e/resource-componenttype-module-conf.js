(function() {
	'use strict';

	// --------------------------------------------------------
	// Resource componenttype module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Componenttype',
		url: 'componenttype',
		internalName: 'resource.componenttype',
		mainEntity: 'Component Type',
		mainEntities: 'Component Types',
		tile: 'resource.componenttype',
		desktop: 'desktopcfg',
		container: [{
			uid: '7b66904e63404334a7c1930a1f6ffd82',
			permission: '7b66904e63404334a7c1930a1f6ffd82',
			name: 'Component Types',
			dependent: [{
				uid: 'e7b2aa01dab8439cae84f3f5258d4e23',
				permission: '7b66904e63404334a7c1930a1f6ffd82',
				name: 'Component Type Details',
				dependent: []
			},
			{
				uid: '3d67ffbc921346179407980c0ccb7a91',
				permission: '3d67ffbc921346179407980c0ccb7a91',
				name: 'Characteristics',
				dependent: []
			}
			]
		}],
		forceLoad: true,
		mainRecords: 5
	});
})();
