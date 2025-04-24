(function() {
	'use strict';

	// --------------------------------------------------------
	// Resource catalog module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Catalog',
		url: 'catalog',
		internalName: 'resource.catalog',
		mainEntity: 'Catalog',
		mainEntities: 'Catalogs',
		tile: 'resource.catalog',
		desktop: 'desktopcfg',
		container: [{
			uid: 'd6267b2141db4c6f831d20c3f95f48f9',
			permission: 'd6267b2141db4c6f831d20c3f95f48f9',
			name: 'Catalogs',
			dependent: [{
				uid: 'd5983c44f2e243e4971ba9c82a73f0b0',
				permission: 'd6267b2141db4c6f831d20c3f95f48f9',
				name: 'Catalog Details',
				dependent: []
			},{
				uid: 'bae34453f83744d3a6f7e53b7851e657',
				permission: 'bae34453f83744d3a6f7e53b7851e657',
				name: 'Records',
				dependent: [{
					uid: 'b6d25f959003460cbf03529c91ad5894',
					permission: 'bae34453f83744d3a6f7e53b7851e657',
					name: 'Record Details',
					dependent: []
				}]
			},{
				uid: '99a21ea527b44736892593accc5e6b6f',
				permission: '99a21ea527b44736892593accc5e6b6f',
				name: 'Price Indices',
				dependent: [{
					uid: '85f0ed0cc8b3488297e3b411b17e5a5b',
					permission: '99a21ea527b44736892593accc5e6b6f',
					name: 'Record Index Details',
					dependent: []
				}]
			},{
				uid: 'c3471218f5694e6f89273acee90547be',
				name: 'Translation',
				permission: 'c3471218f5694e6f89273acee90547be',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 4
	});
})();
