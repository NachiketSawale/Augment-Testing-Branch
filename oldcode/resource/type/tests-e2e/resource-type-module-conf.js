(function() {
	'use strict';

	// --------------------------------------------------------
	// Resource type module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Type',
		url: 'type',
		internalName: 'resource.type',
		mainEntity: 'ResourceType',
		mainEntities: 'ResourceTypes',
		tile: 'resource-types',
		desktop: 'desktopcfg',
		container: [{
			uid: 'b881141e03c14ddfb1aa965c0cb9ea2c',
			permission: 'b881141e03c14ddfb1aa965c0cb9ea2c',
			name: 'Resource Types',
			dependent: [
				{
					uid: '02941383fd24429f9ba46df30b2f6d6c',
					name: 'Resource Type Details',
					permission: 'b881141e03c14ddfb1aa965c0cb9ea2c',
					dependent: []
				},
				{
					uid: 'a0b5aa1be8524f48b1796a06b9ce3e77',
					permission: 'a0b5aa1be8524f48b1796a06b9ce3e77',
					name: 'Required Skills',
					dependent: [{
						uid: 'a6e1e8208327420f85aa92585f851aee',
						permission: 'a0b5aa1be8524f48b1796a06b9ce3e77',
						name: 'Required Skill Details',
						dependent: []
					}]
				},
				{
					uid: 'f60e4938e3d541eb95afe442a8cc6fa4',
					name: 'Translation',
					permission: 'f60e4938e3d541eb95afe442a8cc6fa4',
					dependent: []
				}
			]
		}],
		forceLoad: true,
		mainRecords: 4
	});
})();
