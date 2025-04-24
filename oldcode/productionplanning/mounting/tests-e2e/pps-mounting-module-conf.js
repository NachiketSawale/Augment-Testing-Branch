(function(){
	'use strict';

	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;
	
	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Mounting',
		url: 'mounting',
		mainEntity: 'Mounting',
		mainEntities: 'Mountings',
		tile: 'productionPlanning.mounting',
		desktop: 'desktop',
		container: [{
			uid: '42859c49547445f3862a4ec10588db45',
			permission: '42859c49547445f3862a4ec10588db45',
			name: 'Mounting Requisition List',
			dependent: [{
				uid: '13c366adc02a43a390111cfb411769db',
				permission: '42859c49547445f3862a4ec10588db45',
				name: 'Mounting Requisition Detail',
				dependent: []
			}, {
				uid: '3a37c9d82f4e45c28ccd650f1fd2bc1f',
				permission: '3a37c9d82f4e45c28ccd650f1fd2bc1f',
				name: 'Mounting Activity List',
				dependent: [{
					uid: '2018c762495244fd90af6f30782999a2',
					permission: '3a37c9d82f4e45c28ccd650f1fd2bc1f',
					name: 'Mounting Activity Detail',
					dependent: []
				}, {
					uid: '518268e717e2413a8107c970919eea85',
					permission: '518268e717e2413a8107c970919eea85',
					name: 'Mounting Report List',
					dependent: [{
						uid: 'd0563a6caeb64f34b1a1275cd2c90d85',
						permission: '518268e717e2413a8107c970919eea85',
						name: 'Mounting Report Detail',
						dependent: []
					}, {
						uid: '5dad005fa09b4e2eaf64da8707ec8fe4',
						permission: '5dad005fa09b4e2eaf64da8707ec8fe4',
						name: 'Mounting Report: Products',
						dependent: []
					}, {
						uid: 'abc1d3cdf7584125aa6e6ce9a7f90a88',
						permission: 'abc1d3cdf7584125aa6e6ce9a7f90a88',
						name: 'Time Sheet List',
						dependent: [{
							uid: '809c8d700511425bbe7a5484d306a793',
							permission: 'abc1d3cdf7584125aa6e6ce9a7f90a88',
							name: 'Time Sheet Detail',
							dependent: []
						}]
					}, {
						uid: '7e0d8fd7651a436fa6d4102c11c0b29c',
						permission: '7e0d8fd7651a436fa6d4102c11c0b29c',
						name: 'Mounting Report: Cost Code List',
						dependent: [{
							uid: 'b2ae7b408eb242edb61629a2dbaf3fac',
							permission: '7e0d8fd7651a436fa6d4102c11c0b29c',
							name: 'Mounting Report: Cost Code Detail',
							dependent: []
						}]
					}]
				}, {
					uid: '1470fadb6bc7458fba682135912e68fd',
					permission: '8ea8679532ee44869df8dd9e3ae629de',
					name: 'Mounting Activity: Bundles',
					dependent: []
				}, {
					uid: '1ca707d7fcb143139571e46c10be6a9a',
					permission: 'aaec6786820141e19c4b6febc691652b',
					name: 'Mounting Activity: Transport Requisitions',
					dependent: [{
						uid: '4c1d4fc98d724a2981079ad175b58a10',
						permission: '8ea8679532ee44869df8dd9e3ae629de',
						name: 'Transport Requisitions: Bundles',
						dependent: []
					}, {
						uid: '9ddb621ff9d94cbcbf21adc21d755fcc',
						permission: '291a21ca7ab94d549d2d0c541ec09f5d',
						name: 'Transport Requisitions: Resource Requisition List',
						dependent: []
					}]
				}, {
					uid: '2603701bcae0496d9b3712b0c9dd3b52',
					permission: '291a21ca7ab94d549d2d0c541ec09f5d',
					name: 'Mounting Activity: Resource Requisitions',
					dependent: []
				}, {
					uid: 'fb79a97eac4d4259b7585e99d38ce2da',
					permission: '1046a3bd867147feb794bdb60a805eca',
					name: 'Mounting Activity: Resources',
					dependent: []
				}, {
					uid: '47974d7fd12f445391d94645e230a6d8',
					permission: '318c8b9af84c4cb38086f897aa853d71',
					name: 'Mounting Activity: Material Requsistion List',
					dependent: [{
						uid: '998248965ced4c4b85e65c89de6f6318',
						permission: '318c8b9af84c4cb38086f897aa853d71',
						name: 'Mounting Activity: Material Requsistion Detail',
						dependent: []
					}]
				}, {
					uid: '3ec330c208b04dc8818ef25aaf65a915',
					permission: '8ea8679532ee44869df8dd9e3ae629de',
					name: 'Mounting Activity: Unassigned Bundle List',
					dependent: [{
						uid: 'a59b345367f14f81813a5639b490a6c6',
						permission: '70210ee234ef44af8e7e0e91d45186b2',
						name: 'Unassigned Bundle: Product List',
						dependent: []
					}]
				}, {
					uid: '2441ae38536f4e3f81196ad647ff19a9',
					permission: '73689e2842f6436b9465ff71d79aea80',
					name: 'Dispatcher List',
					dependent: []
				}]
			}, {
				uid: '4cc46f57a4234c998005fb42cffd2842',
				name: 'Translate',
				dependent: []
			}, {
				uid: '58112ccc722e4ef4906a30c0dbe9e1f4',
				permission: '3a37c9d82f4e45c28ccd650f1fd2bc1f',
				name: 'Planning Board',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 10
	});
})();