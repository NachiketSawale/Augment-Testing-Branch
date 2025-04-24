(function () {
	'use strict';

	// --------------------------------------------------------
	// Basics sites module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Activity',
		url: 'activity',
		internalName: 'productionplanning.activity',
		mainEntity: 'Activity',
		mainEntities: 'Activities',
		tile: 'productionPlanning.activity',
		desktop: 'desktop',
		container: [{
			uid: '0fabc9f2d6a946b1bd5517bb7229e10a',
			permission: '3a37c9d82f4e45c28ccd650f1fd2bc1f',
			name: 'Activity List',
			dependent: [{
				uid: '3f4268ef496c4878ac95b92e9cce4220',
				permission: '3a37c9d82f4e45c28ccd650f1fd2bc1f',
				name: 'Activity Detail',
				dependent: []
			}, {
				uid: '1435d4d81ed6429bb7cdcfb80ff39f2b',
				permission: '518268e717e2413a8107c970919eea85',
				name: 'Report List',
				dependent: [{
					uid: '1eb2dcf5d64c4932a8dccb6428ef5520',
					permission: '518268e717e2413a8107c970919eea85',
					name: 'Report Detail',
					dependent: []
				}, {
					uid: 'd747e68bb9544804bf5a908b714315ce',
					permission: '5dad005fa09b4e2eaf64da8707ec8fe4',
					name: 'Report: Products',
					dependent: []
				}, {
					uid: '8bf99dd93c304cc682180dfe164dbab1',
					permission: 'abc1d3cdf7584125aa6e6ce9a7f90a88',
					name: 'TimeSheet List',
					dependent: []
				}, {
					uid: '23161089944840db9321870d77073c74',
					permission: '7e0d8fd7651a436fa6d4102c11c0b29c',
					name: 'Report: Cost Codes',
					dependent: []
				}]
			}, {
				uid: '5195d2ff48d64096a06f44b285781567',
				permission: 'aaec6786820141e19c4b6febc691652b',
				name: 'Transport Requisition List',
				dependent: [{
					uid: '9ddb621ff9d941234f21adc21d755fcc',
					permission: '291a21ca7ab94d549d2d0c541ec09f5d',
					name: 'Transport Requisition: Resource Requisitions',
					dependent: []
				}, {
					uid: '2219ffe26d694ed9ad9f02bdb5c3f1e0',
					permission: '318c8b9af84c4cb38086f897aa853d71',
					name: 'Transport Requisition: Materail Requisitions',
					dependent: []
				}, {
					uid: '9bde56ae4eb14c75aef90c70da4603a7',
					permission: '8ea8679532ee44869df8dd9e3ae629de',
					name: 'Transport Requisition: Bundles',
					dependent: []
				}]
			}, {
				uid: 'e3a318e9bf3b4f38a0424d16174415fb',
				permission: '291a21ca7ab94d549d2d0c541ec09f5d',
				name: 'Activity: Resource Requisitions',
				dependent: []
			}, {
				uid: 'c6b1b36cd9ee4df3b1572b05fff8a5e9',
				permission: '8ea8679532ee44869df8dd9e3ae629de',
				name: 'Activity: Bundles',
				dependent: []
			}, {
				uid: 'f5f8ae2b3e49409aaf487279a3172c48',
				permission: '5907fffe0f9b44588254c79a70ba3af1',
				name: 'PPS Items',
				dependent: []
			}, {
				uid: 'b70cb2a2923f4b34af82fbea35f8725d',
				permission: '8ea8679532ee44869df8dd9e3ae629de',
				name: 'Activity: Unassigned Bundles',
				dependent: [{
					uid: '17aa3e9e12c04e92a351bfdfa2b17530',
					permission: '5d32c2debd3646ab8ef0457135d35624',
					name: 'Unassigned Bundle: Products',
					dependent: []
				}]
			}, {
				uid: '0579fab6065b4c49b2a4ac2936327336',
				permission: '1046a3bd867147feb794bdb60a805eca',
				name: 'Actvity: Resources',
				dependent: []
			}, {
				uid: '3fe6fe947a1a4c008bdecd9b09e95197',
				permission: '3a37c9d82f4e45c28ccd650f1fd2bc1f',
				name: 'Planningboard',
				dependent: []
			}, {
				uid: '964e16bab90f497a9ebcf1e80c70ff7c',
				name: 'Translate',
				dependent: []
			}, {
				uid: '7d166959271d4a24a99ca57c1748cd92',
				permission: '73689e2842f6436b9465ff71d79aea80',
				name: 'Activity: Dispatchers',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 10
	});
})();
