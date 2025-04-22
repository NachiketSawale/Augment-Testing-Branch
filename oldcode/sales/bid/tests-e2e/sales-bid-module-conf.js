(function () {
	'use strict';
	// sales-bid module configuration

	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Sales Bid',
		url: 'bid',
		internalName: 'sales.bid',
		mainEntity: 'Bid',
		mainEntities: 'Bids',
		tile: 'sales.bid',
		desktop: 'desktop',
		container: [{
			'name': 'Bids',
			'uid': '7001204d7fb04cf48d8771c8971cc1e5',
			'dependent': [{
				'name': 'Bid Details',
				'uid': '1918073bf2664785b1b9223c6e443d6d',
				'permission': '7001204d7fb04cf48d8771c8971cc1e5',
				'dependent': []
			}, {
				'name': 'Header Plain Text',
				'uid': '173343c2fdf04186b32bb4b9526aff4f',
				'permission': '7001204d7fb04cf48d8771c8971cc1e5',
				'dependent': []
			}, {
				'name': 'Header Formatted Text',
				'uid': '6f184332b0b2496f8d6ab3201e8e1bde',
				'permission': '7001204d7fb04cf48d8771c8971cc1e5',
				'dependent': []
			}, {
				'name': 'Generals List',
				'uid': 'd440373784664e58bbb3f57e66ef9566',
				'dependent': [{
					'name': 'Generals Detail',
					'uid': '953385da027f45f786244d350d7124fd',
					'permission': 'd440373784664e58bbb3f57e66ef9566',
					'dependent': []
				}]
			}, {
				'name': 'Billing Schema',
				'uid': '3de6ddaa808c45d39f71803909cbb06a',
				'dependent': []
			}, {
				'name': 'Pin Board',
				'uid': 'fdd90b3f00ce4390bcd4a798d0dbf847',
				'dependent': []
			}, {
				'name': 'Characteristics',
				'uid': 'cff858f883ac47919f261c269eb84261',
				'dependent': []
			}, {
				'name': 'BoQs',
				'uid': 'c394fffc7b2b49c68a175614117084d0',
				'noCreateDelete': true,
				'dependent': [{
					'name': 'BoQ Details',
					'uid': 'dbd4af01c38d43dca8f80c7086a5691b',
					'permission': 'ce8cd4ae57f34df0b5e2ea3e60acb28e',
					'dependent': []
				}, {
					'name': 'BoQ Structure',
					'uid': 'ce8cd4ae57f34df0b5e2ea3e60acb28e',
					'dependent': [{
						'name': 'Specification Plain Text',
						'uid': '2f4c3a98172f4fad8601ec635977f594',
						'permission': 'ce8cd4ae57f34df0b5e2ea3e60acb28e',
						'dependent': []
					}, {
						'name': 'Specification',
						'uid': 'c2480e233eb441a09e2e0904333ed185',
						'permission': 'ce8cd4ae57f34df0b5e2ea3e60acb28e',
						'dependent': []
					}, {
						'name': 'Plain Text Complements',
						'uid': '1ed54414f33640f5b2bed071f17dda5f',
						'permission': 'ce8cd4ae57f34df0b5e2ea3e60acb28e',
						'dependent': []
					}, {
						'name': 'Text Complements',
						'uid': 'de2ecbe9450a401eb38d013a35c5bf3b',
						'permission': 'ce8cd4ae57f34df0b5e2ea3e60acb28e',
						'dependent': []
					}, {
						'name': 'Surcharge On',
						'uid': 'b984bab23bfe42f991338ce28f6bf7c1',
						'permission': 'ce8cd4ae57f34df0b5e2ea3e60acb28e',
						'dependent': []
					}, {
						'name': 'Split Quantities',
						'uid': 'deb38a79e18048f5b8a6f3f6b77e490f',
						'permission': 'ce8cd4ae57f34df0b5e2ea3e60acb28e',
						'dependent': []
					}]
				}]
			}, {
				'name': 'Form Data',
				'uid': '13599a7eabfa444aa9b34da16893dea4',
				'dependent': []
			}, {
				'name': 'Translation',
				'uid': '96ec1c43569a44c490010d4af9365715',
				'dependent': []
			}, {
				'name': 'Source BoQ',
				'uid': 'd66359e4102549f0a4a783d784a3c699',
				'dependent': []
			}]
		}],
		forceLoad: true,
		sidebarFilter: 'E2E-',
		mainRecords: 10
	});
})();
