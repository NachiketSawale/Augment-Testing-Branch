(function () {
	'use strict';

	// --------------------------------------------------------
	// Basics workflow module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Workflow',
		url: 'workflow',
		mainEntity: 'Workflow Template',
		mainEntities: 'Workflow Templates',
		tile: 'basics.workflow',
		desktop: 'desktopcfg',
		forceLoad: true,
		mainRecords: 5,
		container: [{
			uid: '14d5f58009ff11e5a6c01697f925ec7b',
			permission: '14d5f58009ff11e5a6c01697f925ec7b',
			name: 'Workflow Templates',
			dependent: [{
				uid: 'c1abf57656fc418e8e9acc65aa0e9ea4',
				permission: 'c1abf57656fc418e8e9acc65aa0e9ea4',
				name: 'Workflow Designer',
				dependent: []
			}, {
				uid: 'a040cedc1e2d11e5b5f7727283247c7f',
				permission: 'a040cedc1e2d11e5b5f7727283247c7f',
				name: 'Workflow Action Detail',
				dependent: []
			}, {
				uid: '8d61c1ee263a11e5b345feff819cdc9f',
				permission: '8d61c1ee263a11e5b345feff819cdc9f',
				name: 'Workflow Template Context',
				dependent: []
			}]
		}]
	});
})();
