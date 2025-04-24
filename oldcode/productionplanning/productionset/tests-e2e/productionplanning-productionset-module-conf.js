(function(){
	'use strict';

	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;
	
	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'ProductionSet',
		url: 'productionset',
		internalName: 'productionplanning.productionset',
		mainEntity: 'ProductionSet',
		mainEntities: 'ProductionSets',
		tile: 'productionPlanning.productionset',
		desktop: 'desktop',
		container: [{
			uid: '2581963f63944bdca59bec07f539cafb',
			permission: '2581963f63944bdca59bec07f539cafb',
			name: 'Production Set List',
			dependent: [{
				uid: '9e6d0550dbc845abbba4c239fc4763e5',
				permission: '2581963f63944bdca59bec07f539cafb',
				name: 'Production Set Detail',
				dependent: []
			}, {
				uid: '123e3750bcbf4d2580f02e3a34bb5yut',
				permission: '123e3750bcbf4d2580f02e3a34bb5yut',
				name: 'Production Set: Events',
				dependent: []
			}, {
				uid: 'd8c96cdc54a840bfb7651c3228f19887',
				permission: 'd8c96cdc54a840bfb7651c3228f19887',
				name: 'Product List',
				dependent: [{
					uid: '1d2b2bf19d0d44b88539ccu58db79d18',
					permission: 'd8c96cdc54a840bfb7651c3228f19887',
					name: 'Product Detail',
					dependent: []
				}, {
					uid: 'caf2a35c626a4a46ac20651a09938bbf',
					permission: 'caf2a35c626a4a46ac20651a09938bbf',
					name: 'Product: Events',
					dependent: []
				}]
			}, {
				uid: '96f5cf010264456888ca1fcda1bca0bf',
				name: 'Translate',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 10
	});
})();
