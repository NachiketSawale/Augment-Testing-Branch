(function(){
	'use strict';

	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;
	
	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'PPSItem',
		url: 'item',
		mainEntity: 'PPSItem',
		mainEntities: 'PPSItems',
		tile: 'productionPlanning.item',
		desktop: 'desktop',
		container: [{
			uid: '5907fffe0f9b44588254c79a70ba3af1',
			permission: '5907fffe0f9b44588254c79a70ba3af1',
			name: 'Item List',
			dependent: [{
				uid: '2ded3fea233f40f4a00a5d9636297df8',
				permission: '5907fffe0f9b44588254c79a70ba3af1',
				name: 'Item Detail',
				dependent: []
			}, {
				uid: '5d32c2debd3646ab8ef0457135d35624',
				permission: '5d32c2debd3646ab8ef0457135d35624',
				name: 'Item Events',
				dependent: []
			}, {
				uid: '4b3bf707e6ee44748685a142a57168b4',
				permission: '4b3bf707e6ee44748685a142a57168b4',
				name: 'Product Description List',
				dependent: [{
					uid: '32b419bf9fcc4069910e4b9396239780',
					permission: '4b3bf707e6ee44748685a142a57168b4',
					name: 'Product Description Detail',
					dependent: []
				}, {
					uid: '879ada03c5074b3d814053650fc8f5fb',
					permission: '879ada03c5074b3d814053650fc8f5fb',
					name: 'Product Description Events',
					dependent: []
				}, {
					uid: 'b8f62ee7274249be86e2fd4e26eba76e',
					permission: 'b8f62ee7274249be86e2fd4e26eba76e',
					name: 'Product Description: Product List',
					dependent: [{
						uid: '327e3750bcbf4d2580f02e3a34bb54ea',
						permission: '70210ee234ef44af8e7e0e91d45186b2',
						name: 'Product Description: Product Events',
						dependent: []
					}, {
						uid: '90b9295c8fa14c0c9407e10aa7adb4b0',
						permission: '6d8ad94435f1431f912817677b31d475',
						name: 'Product Description: Product Param List',
						dependent: []
					}]
				}, {
					uid: '0552ba86fc1e4d559ef93c2a10e0696b',
					permission: '0552ba86fc1e4d559ef93c2a10e0696b',
					name: 'Product Description Param List',
					dependent: []
				}]
			}, {
				uid: '92e45c26b45f4637980c0ba38bf8cd31',
				permission: '92e45c26b45f4637980c0ba38bf8cd31',
				name: 'Item: Product List',
				dependent: [{
					uid: '10086dab68ab43bd81d91aa034f028a5',
					permission: '92e45c26b45f4637980c0ba38bf8cd31',
					name: 'Item: Product Detail',
					dependent: []
				}, {
					uid: 'b51857fedc364b9f87102fcb6988bf7b',
					permission: 'b51857fedc364b9f87102fcb6988bf7b',
					name: 'Product Events',
					dependent: []
				}]
			}, {
				uid: '1be00bc3b8184a4c9665c107ec150e10',
				permission: '9ade398dbcba41c79a9806e8250c49e6',
				name: 'Package List',
				dependent: [{
					uid: 'd3f2607882c84b90aa7444c889727436',
					permission: '9ade398dbcba41c79a9806e8250c49e6',
					name: 'Package Detail',
					dependent: []
				}, {
					uid: '579bed22d4684fe6905084f884150272',
					permission: '5d32c2debd3646ab8ef0457135d35624',
					name: 'Package Events',
					dependent: []
				}]
			}, {
				uid: 'd7cd0e614f1a44889d161544e35cb07e',
				name: 'Translate',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 10
	});
})();