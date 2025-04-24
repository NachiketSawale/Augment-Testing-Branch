(function () {
	'use strict';

	// --------------------------------------------------------
	// Basics accountingjournals module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Accountingjournals',
		url: 'accountingJournals',
		mainEntity: 'Transaction Header',
		mainEntities: 'Transaction Headers',
		tile: 'basics.accountingjournals',
		desktop: 'desktopcfg',
		forceLoad: true,
		mainRecords: 1,
		container: [{
			uid: '008f7b6e76f14ad5b5b16365e2d11823',
			permission: '008f7b6e76f14ad5b5b16365e2d11823',
			name: 'Transaction Headers',
			dependent: [{
				uid: '26ef760cd529457da85feadc241f16bb',
				permission: '008f7b6e76f14ad5b5b16365e2d11823',
				name: 'Transaction Header Details',
				dependent: []
			}, {
				uid: 'c11b5b707ff744cf9a8eddd26633db43',
				permission: 'c11b5b707ff744cf9a8eddd26633db43',
				name: 'Transactions',
				dependent: [{
					uid: '1772fe6173c7471eb256e9fa08a054f6',
					permission: 'c11b5b707ff744cf9a8eddd26633db43',
					name: 'Transaction Details',
					dependent: []
				}]
			}]
		}]
	});
})();