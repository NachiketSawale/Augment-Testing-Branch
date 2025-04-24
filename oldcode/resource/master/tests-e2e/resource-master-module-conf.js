(function() {
	'use strict';

	// --------------------------------------------------------
	// Resource master module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Master',
		url: 'master',
		internalName: 'resource.master',
		mainEntity: 'Resource',
		mainEntities: 'Resources',
		tile: 'resource-master',
		desktop: 'desktopcfg',
		container: [{
			uid: '1046a3bd867147feb794bdb60a805eca',
			permission: '1046a3bd867147feb794bdb60a805eca',
			name: 'Resources',
			dependent: [{
				uid: 'd9391c21eaac4fb7b5db3178af56bdaa',
				permission: '1046a3bd867147feb794bdb60a805eca',
				name: 'Resource Details',
				dependent: []
			},
			{
				uid: '29278b487bd2434f8781b5929d9534cf',
				permission: '29278b487bd2434f8781b5929d9534cf',
				name: 'Resource Pools',
				dependent: [{
					uid: 'dde848354d474e529b937de53400357f',
					permission: '29278b487bd2434f8781b5929d9534cf',
					name: 'Resource Pool Details',
					dependent: []
				}]
			},
			{
				uid: '3467f2642146437c94710b964f0c59cb',
				permission: '3467f2642146437c94710b964f0c59cb',
				name: 'Resource Photo',
				dependent: []
			},
			{
				uid: '19c2a8a3346b40fda7364c2f3dda7f2e',
				permission: '19c2a8a3346b40fda7364c2f3dda7f2e',
				name: 'Comments',
				dependent: []
			},
			{
				uid: '766992dd001b4c2aa739c35d222186f9',
				permission: '766992dd001b4c2aa739c35d222186f9',
				name: 'Translation',
				dependent: []
			},
			{
				uid: '485827a79a4b41b5aa8db9f323810cd2',
				permission: '485827a79a4b41b5aa8db9f323810cd2',
				name: 'Required Skills',
				dependent: [{
					uid: '0fe7865b879b4dc0a9b2c8f88dd71484',
					permission: '485827a79a4b41b5aa8db9f323810cd2',
					name: 'Required Skill Details',
					dependent: []
				}]
			},
			{
				uid: '9a9a8a01924849b484a03d3a85b67d82',
				permission: '9a9a8a01924849b484a03d3a85b67d82',
				name: 'Provided Skills',
				dependent: [{
					uid: 'ff80c868f7b4469bba84cdf800afbb56',
					permission: '9a9a8a01924849b484a03d3a85b67d82',
					name: 'Provided Skill Details',
					dependent: []
				}]
			},
			{
				uid: 'dd7c02126a9c4654bb7d99ece8af7caa',
				permission: 'dd7c02126a9c4654bb7d99ece8af7caa',
				name: 'Resource Parts',
				dependent: [{
					uid: 'bb8ddc00f77c4535ada29aa2fd3b21d7',
					permission: 'dd7c02126a9c4654bb7d99ece8af7caa',
					name: 'Resource Part Details',
					dependent: []
				}]
			}
			]
		}],
		forceLoad: true,
		sidebarFilter: 'E2E-',
		mainRecords: 2
	});
})();
