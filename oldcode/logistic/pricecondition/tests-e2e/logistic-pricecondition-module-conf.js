(function () {
	'use strict';

	// --------------------------------------------------------
	// Logistic dispatching module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Logistic Price Condition',
		url: 'pricecondition',
		internalName: 'logistic.pricecondition',
		mainEntity: 'Price Condition',
		mainEntities: 'Price Conditions',
		tile: 'logistic.pricecondition',
		desktop: 'desktopcfg',
		container: [{
			uid: '5d0e37f033664ce6b0faf2114db0906a',
			permission: '5d0e37f033664ce6b0faf2114db0906a',
			name: 'Conditions',
			dependent: [{
					uid: '24c4f1aecb6d4a5aa735201177521649',
					permission: '5d0e37f033664ce6b0faf2114db0906a',
					name: 'Condition Details',
					dependent: []
				},
				{
					uid: 'bc0c1a5bc4dc420d98bd85a0eeac59f4',
					permission: 'bc0c1a5bc4dc420d98bd85a0eeac59f4',
					name: 'Condition Items',
					dependent: [{
						uid: '96e91752e0ca46f59eb4b332fb6573b4',
						permission: 'bc0c1a5bc4dc420d98bd85a0eeac59f4',
						name: 'Condition Item Details',
						dependent: []
					}]
				},
				{
					uid: 'bc736a161cc248eaad95db451e06b541',
					permission: 'bc736a161cc248eaad95db451e06b541',
					name: 'Plant Catalog Prices',
					dependent: [{
						uid: '6e88700ea7a54efe805436ee4272ba99',
						permission: 'bc736a161cc248eaad95db451e06b541',
						name: 'Plant Catalog Price Details',
						dependent: []
					}]
				},
				{
					uid: 'bd261e0906984702a6d01964ffc58bcc',
					permission: 'bd261e0906984702a6d01964ffc58bcc',
					name: 'Material Catalog Prices',
					dependent: [{
						uid: '00c2aee866bc4607b3824ea4e05700b6',
						permission: 'bd261e0906984702a6d01964ffc58bcc',
						name: 'Material Catalog Price Details',
						dependent: []
					}]
				},
				{
					uid: '2934c2d1160447bc860cc5c3897e4d9f',
					permission: '2934c2d1160447bc860cc5c3897e4d9f',
					name: 'Plant Prices',
					dependent: [{
						uid: 'dc76760660e9466da30b5a7116fc2f52',
						permission: '2934c2d1160447bc860cc5c3897e4d9f',
						name: 'Plant Price Details',
						dependent: []
					}]
				},
				{
					uid: '76206e93e60a4f60a71fd0d0961c6da1',
					permission: '76206e93e60a4f60a71fd0d0961c6da1',
					name: 'Sundry Service Prices',
					dependent: [{
						uid: '9eefecb804a840e0bcefd6825c957374',
						permission: '76206e93e60a4f60a71fd0d0961c6da1',
						name: 'Sundry Service Price Details',
						dependent: []
					}]
				},
				{
					uid: 'e07d54925ba64e7db4928907939e1bda',
					permission: 'e07d54925ba64e7db4928907939e1bda',
					name: 'Cost Code Rates',
					dependent: [{
						uid: 'e37b49b2796d4950bd7c54dfaf6cf86a',
						permission: 'e07d54925ba64e7db4928907939e1bda',
						name: 'Cost Code Rate Details',
						dependent: []
					}]
				}
			]}
		],
		forceLoad: true,
		sidebarFilter: 'E2E-',
		mainRecords: 1
	});
})();
