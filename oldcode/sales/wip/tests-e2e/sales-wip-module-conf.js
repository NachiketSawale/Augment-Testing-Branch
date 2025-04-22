(() => {
	'use strict';
	// sales-wip module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Sales Wip',
		url: 'wip',
		internalName: 'sales.wip',
		mainEntity: 'WIP',
		mainEntities: 'WIPs',
		tile: 'sales.wip',
		desktop: 'desktop',
		container: [{
			'name': 'WIP',
			'uid': '689e0886de554af89aadd7e7c3b46f25',
			'dependent': [{
				'name': 'WIP Details',
				'uid': 'd7bfa7174fc14ab49acef0c6f6b6678b',
				'permission': '689e0886de554af89aadd7e7c3b46f25',
				'dependent': []
			}, {
				'name': 'Pin Board',
				'uid': 'd668042b28334763a0d7f001cc6bd45d',
				'dependent': []
			}, {
				'name': 'Characteristics',
				'uid': '79db0ff7fcda4e0c944fcde734878044',
				'dependent': []
			}, {
				'name': 'BoQs',
				'uid': '27cbdfed58e44dbd8d3b3c07b54bbc1f',
				'noCreateDelete': true,
				'dependent': [{
					'name': 'BoQ Structure',
					'uid': '6e5b061fc7014aec91717edbb576312c',
					'dependent': [{
						'name': 'Specification Plain Text',
						'uid': '38bee30f8e9144268dd68802d8148beb',
						'permission': '6e5b061fc7014aec91717edbb576312c',
						'dependent': []
					}, {
						'name': 'Plain Text Complements',
						'uid': '1192f97427d7437fabfb9f8c9e4ec154',
						'permission': '6e5b061fc7014aec91717edbb576312c',
						'dependent': []
					}, {
						'name': 'Specification',
						'uid': 'de68a62cfbb54345b39e11e163774878',
						'permission': '6e5b061fc7014aec91717edbb576312c',
						'dependent': []
					}, {
						'name': 'Text Complements',
						'uid': '25aa99f15e6c4ba18d48fb1c917bc7b3',
						'permission': '6e5b061fc7014aec91717edbb576312c',
						'dependent': []
					}, {
						'name': 'Surcharge On',
						'uid': '27e4d18013114329bd2b57cc2e07708a',
						'permission': '6e5b061fc7014aec91717edbb576312c',
						'dependent': []
					}, {
						'name': 'Split Quantities',
						'uid': 'bd6d68861c554585b3d065ffd07c3449',
						'permission': '6e5b061fc7014aec91717edbb576312c',
						'dependent': []
					}]
				}, {
					'name': 'BoQ Details',
					'uid': 'c9a82535b2a94de5957ad68162b91a3a',
					'permission': '6e5b061fc7014aec91717edbb576312c',
					'dependent': []
				}]
			}, {
				'name': 'Translation',
				'uid': '1f821207112b4cbeb037d941b18b7338',
				'dependent': []
			}, {
				'name': 'Source BoQ',
				'uid': 'dfdfdc6f81054522998c9ceb6eb3b24f',
				'dependent': []
			}, {
				'name': 'Form Data',
				'uid': 'da8b5f2c30ae4e6dafffdb3db1e17699',
				'dependent': []
			}]
		}],
		forceLoad: true,
		sidebarFilter: 'E2E-',
		mainRecords: 1
	});
})();
