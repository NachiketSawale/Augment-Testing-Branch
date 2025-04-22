(function () {
	'use strict';
	// sales-billing module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Sales Billing',
		url: 'billing',
		internalName: 'sales.billing',
		mainEntity: 'Bill',
		mainEntities: 'Bills',
		tile: 'sales.billing',
		desktop: 'desktop',
		container: [{
			'name': 'Bills',
			'uid': '39608924dc884afea59fe04cb1434543',
			'dependent': [{
				'name': 'Invoice Summary',
				'uid': 'f825fabe0d0949ea8ef3f6c6dbbdea60',
				'dependent': []
			}, {
				'name': 'Transaction',
				'uid': 'd45fb0e93b5a4101b875c66686887918',
				'noCreateDelete': true,
				'dependent': [{
					'name': 'Transaction Details',
					'uid': '3fe17cc5f81847e99667f903642150d8',
					'permission': 'd45fb0e93b5a4101b875c66686887918',
					'dependent': []
				}]
			}, {
				'name': 'Validation',
				'uid': '1247ef00dfce413793b328f685f7ca27',
				'noCreateDelete': true,
				'dependent': [{
					'name': 'Validation Details',
					'uid': '381859cb3a9e46829179bfc91d11af89',
					'permission': '1247ef00dfce413793b328f685f7ca27',
					'dependent': []
				}]
			}, {
				'name': 'Items',
				'uid': 'eb36fda6b4de4965b4e98ec012d0506b',
				'dependent': [{
					'name': 'Item Details',
					'uid': 'a0ac5d8ad3824c08bcc23d887cb45077',
					'permission': 'eb36fda6b4de4965b4e98ec012d0506b',
					'dependent': []
				}]
			}, {
				'name': 'BoQs',
				'uid': '03e13f5f6c6e44a8ae8cd897814887ac',
				'noCreateDelete': true,
				'dependent': [{
					'name': 'BoQ Structure',
					'uid': '65294188ea2f4aeea7f1243ecf096434',
					'dependent': [{
						'name': 'Specification Plain Text',
						'uid': 'fa13fda59e1a4c1d928e78a84c9e0928',
						'permission': '65294188ea2f4aeea7f1243ecf096434',
						'dependent': []
					}, {
						'name': 'Plain Text Complements',
						'uid': '5be7a3626fd6417ead93f36bbb17ab50',
						'permission': '65294188ea2f4aeea7f1243ecf096434',
						'dependent': []
					}, {
						'name': 'Specification',
						'uid': '00cb5559833c4618b36590d71da02143',
						'permission': '65294188ea2f4aeea7f1243ecf096434',
						'dependent': []
					}, {
						'name': 'Text Complements',
						'uid': '0d6825535a70464caf5aa3604eb6bfc5',
						'permission': '65294188ea2f4aeea7f1243ecf096434',
						'dependent': []
					}, {
						'name': 'Surcharge On',
						'uid': '9170662424c7407bae4d960cc8e2663f',
						'permission': '65294188ea2f4aeea7f1243ecf096434',
						'dependent': []
					}, {
						'name': 'Split Quantities',
						'uid': 'd5f64179c92a489d9df9adce90bc657e',
						'permission': '65294188ea2f4aeea7f1243ecf096434',
						'dependent': []
					}]
				}, {
					'name': 'BoQ Details',
					'uid': '5bcf0e65d7634d5ea66752571a53f4c0',
					'permission': '65294188ea2f4aeea7f1243ecf096434',
					'dependent': []
				}]
			}, {
				'name': 'Pin Board',
				'uid': '99e67d71f2a84cdf9d116a3348258a22',
				'dependent': []
			}, {
				'name': 'Characteristics',
				'uid': '1614ed65978741289965a4595a2becbd',
				'dependent': []
			}, {
				'name': 'Generals List',
				'uid': '024a6871ea284639b80307eef7af32be',
				'dependent': [{
					'name': 'Generals Detail',
					'uid': 'a24b8036afc1413fbdaa16e9edc73447',
					'permission': '024a6871ea284639b80307eef7af32be',
					'dependent': []
				}]
			}, {
				'name': 'Billing Schema',
				'uid': '9715b5644bb84661985187e09ae646ac',
				'dependent': []
			}, {
				'name': 'Header Plain Text',
				'uid': 'e9e9197b7c1a4eeeb9a609c2b4b65994',
				'permission': '39608924dc884afea59fe04cb1434543',
				'dependent': []
			}, {
				'name': 'Header Formatted Text',
				'uid': 'c98d0a11654046d3b67b7e427a2bbcc0',
				'permission': '39608924dc884afea59fe04cb1434543',
				'dependent': []
			}, {
				'name': 'Bill Details',
				'uid': 'e66e01dcb9d94aa889f0a8de3a16a65a',
				'permission': '39608924dc884afea59fe04cb1434543',
				'dependent': []
			}, {
				'name': 'Source BoQ',
				'uid': '7e709d727707409ea11592459000a289',
				'dependent': []
			}, {
				'name': 'Form Data',
				'uid': '2d5e03e10f484ba687aede096c618680',
				'dependent': []
			}, {
				'name': 'Translation',
				'uid': '0c1c039b62e8439a8c82eb287bac3441',
				'dependent': []
			}]
		}],
		forceLoad: true,
		sidebarFilter: 'E2E-',
		mainRecords: 1
	});
})();
