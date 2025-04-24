(function () {
	'use strict';

	// --------------------------------------------------------
	// Logistic dispatching module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Sundry Service Groups',
		url: 'sundrygroup',
		internalName: 'logistic.sundrygroup',
		mainEntity: 'Sundry Service Group',
		mainEntities: 'Sundry Service Groups',
		tile: 'logistic.sundrygroup',
		desktop: 'desktopcfg',
		container: [{
			uid: 'c89773b5e5b342339203a99d29c07c09',
			permission: 'c89773b5e5b342339203a99d29c07c09',
			name: 'Sundry Service Groups',
			dependent: [{
					uid: '5702f80f88aa494db2bddec1d42c05d9',
					permission: 'c89773b5e5b342339203a99d29c07c09',
					name: 'Sundry Service Group Details',
					dependent: []
				},{
					uid: 'c2b21e2891ad4162aa6adebc111623d5',
					permission: 'c2b21e2891ad4162aa6adebc111623d5',
					name: 'Accounts',
					dependent: [{
						uid: '6ffe2a8357dd4782b8d9abea6680326e',
						permission: 'c2b21e2891ad4162aa6adebc111623d5',
						name: 'Account Details',
						dependent: []
					}]
				},{
					uid: '7d9123130ed4437cba136e05a0911a06',
					permission: '7d9123130ed4437cba136e05a0911a06',
					name: 'Translation',
					dependent: []
				}
			]
		}],
		forceLoad: true,
		sidebarFilter: 'E2E-',
		mainRecords: 2
	});
})();
