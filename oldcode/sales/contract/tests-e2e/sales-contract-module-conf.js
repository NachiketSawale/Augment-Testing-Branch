(function () {
	'use strict';
	// sales-contract module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Sales Contract',
		url: 'contract',
		internalName: 'sales.contract',
		mainEntity: 'Contract',
		mainEntities: 'Contracts',
		tile: 'sales.contract',
		desktop: 'desktop',
		container: [{
			'name': 'Contracts',
			'uid': '34d0a7ece4f34f2091f7ba6c622ff04d',
			'dependent': [{
				'name': 'Contract Details',
				'uid': 'ac528547872e450584f6e1dd43922c64',
				'permission': '34d0a7ece4f34f2091f7ba6c622ff04d',
				'dependent': []
			}, {
				'name': 'Header Plain Text',
				'uid': '5bdd2357a22c45a18b9171f8b8782252',
				'permission': '34d0a7ece4f34f2091f7ba6c622ff04d',
				'dependent': []
			}, {
				'name': 'Header Formatted Text',
				'uid': '189729fbbfde4c2ab385324814d4a46e',
				'permission': '34d0a7ece4f34f2091f7ba6c622ff04d',
				'dependent': []
			}, {
				'name': 'Billing Schema',
				'uid': 'e303c8ae08b246348e6686882e17dfae',
				'dependent': []
			}, {
				'name': 'Pin Board',
				'uid': '1f5fb2343b174db184b980d13161ab98',
				'dependent': []
			}, {
				'name': 'Characteristics',
				'uid': 'b66b7f483a5f443ea622b272d438a77c',
				'dependent': []
			}, {
				'name': 'productionplanning.common.header.listTitle', // TODO: translation
				'uid': '99ce1ede67e44133a760b20adcd4a9aa',
				'permission': '99ce1ede67e44133a760b20adcd4a9aa',
				'dependent': []
			}, {
				'name': 'productionplanning.common.header.detailTitle', // TODO: translation
				'uid': '955aa9d777044174b55834db1f7670a6',
				'permission': '99ce1ede67e44133a760b20adcd4a9aa',
				'dependent': []
			}, {
				'name': 'productionplanning.common.event.headerEventTitle', // TODO: translation
				'uid': '9fe62b05c136465a9b29bdb00ae4c6b8',
				'permission': '9fe62b05c136465a9b29bdb00ae4c6b8',
				'dependent': []
			}]
		}, {
			'name': 'Translation',
			'uid': '382b89267ebe4aec801a257618a2d012',
			'dependent': []
		}, {
			'name': 'Generals List',
			'uid': 'b85fea01f0a4414594542caf845b3b95',
			'dependent': [{
				'name': 'Generals Detail',
				'uid': '61113429868d4e59b85751d84972ad54',
				'permission': 'b85fea01f0a4414594542caf845b3b95',
				'dependent': []
			}]
		}, {
			'name': 'BoQs',
			'uid': 'ad818cba8fbb4ef1880027482ffaea1a',
			'dependent': [{
				'name': 'BoQ Details',
				'uid': '98b1cc738c1242d283ca49c82ece0295',
				'permission': '8d52d213015f4df6b3fb07d6fd81cb42',
				'dependent': []
			}, {
				'name': 'BoQ Structure',
				'uid': '8d52d213015f4df6b3fb07d6fd81cb42',
				'dependent': [{
					'name': 'Specification Plain Text',
					'uid': '2d209fe674da4c9b82e3a86e1c036427',
					'permission': '8d52d213015f4df6b3fb07d6fd81cb42',
					'dependent': []
				}, {
					'name': 'Plain Text Complements',
					'uid': 'a9da15ea81134425b5e3199e4baef2af',
					'permission': '8d52d213015f4df6b3fb07d6fd81cb42',
					'dependent': []
				}, {
					'name': 'Specification',
					'uid': '6fee5ef522bd4eaa81661fc1288b7931',
					'permission': '8d52d213015f4df6b3fb07d6fd81cb42',
					'dependent': []
				}, {
					'name': 'Text Complements',
					'uid': '4b568634091d443f960c3349102d846c',
					'permission': '8d52d213015f4df6b3fb07d6fd81cb42',
					'dependent': []
				}, {
					'name': 'Surcharge On',
					'uid': '4cd2adfba78c4a7c92450371f9b9678e',
					'permission': '8d52d213015f4df6b3fb07d6fd81cb42',
					'dependent': []
				}, {
					'name': 'Split Quantities',
					'uid': '024492dad0a7493abf07220a9d2b6f84',
					'permission': '8d52d213015f4df6b3fb07d6fd81cb42',
					'dependent': []
				}]
			}]
		}, {
			'name': 'Source BoQ',
			'uid': 'f02a7d91fd0a410fac8a0fcb0c59e7d5',
			'dependent': []
		}, {
			'name': 'Form Data',
			'uid': '1428e0585b854403acabefe8acf7c2ee',
			'dependent': []
		}],
		forceLoad: true,
		sidebarFilter: 'E2E-',
		mainRecords: 1
	});
})();
