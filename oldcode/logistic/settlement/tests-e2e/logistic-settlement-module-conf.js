(function () {
	'use strict';

	// --------------------------------------------------------
	// Logistic dispatching module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Settlement',
		url: 'settlement',
		internalName: 'logistic.settlement',
		mainEntity: 'Settlement',
		mainEntities: 'Settlements',
		tile: 'logistic.settlement',
		desktop: 'desktop',
		container: [{
			uid: 'f766b788850241e9a338eb411dafbd79',
			name: 'Settlements',
			dependent: [{
					uid: 'cc74b0044501457194046d47ca7dc2de',
					name: 'Settlement Details',
					dependent: []
				},
				{
					uid: '83b83e9c1f704f74bf28f721435b7f93',
					name: 'Settlement Items',
					dependent: [{
						uid: '9b6d9118e5bc486b816323c36d7626cb',
						name: 'Settlement Item Details',
						dependent: []
					}]
				},
				{
					uid: 'b2e8f2664b684862a796698a7235305f',
					name: 'Formatted Text 1',
					dependent: []
				},
				{
					uid: 'f17f6ae7602b4f8d976c0376ab3f7b27',
					name: 'Formatted Text 2',
					dependent: []
				},
				{
					uid: '27c61887696745768368bd15f437eb1b',
					name: 'Formatted Text 3',
					dependent: []
				},
				{
					uid: '6c8e98371244440e83b70eb6649633e2',
					name: 'Formatted Text 4',
					dependent: []
				},
				{
					uid: 'f8e4363d6ec845cf86b0fce9655430f6',
					name: 'Formatted Text 5',
					dependent: []
				},
				{
					uid: 'b787937d61474c7280aee33f6f054500',
					name: 'Formatted Text 6',
					dependent: []
				}
			]
		}],
		forceLoad: true,
		sidebarFilter: 'E2E-',
		mainRecords: 1
	});
})();
