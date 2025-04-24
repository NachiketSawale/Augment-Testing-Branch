(function() {
	'use strict';

	// --------------------------------------------------------
	// Resource requisition module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Requisition',
		url: 'requisition',
		internalName: 'resource.requisition',
		mainEntity: 'Requisition',
		mainEntities: 'Requisitions',
		tile: 'resource-requisition',
		desktop: 'desktop',
		container: [{
			uid: '291a21ca7ab94d549d2d0c541ec09f5d',
			permission: '291a21ca7ab94d549d2d0c541ec09f5d',
			name: 'Requisitions',
			dependent: [{
				uid: '44398421b57043bc906469bf7b9991eb',
				permission: '291a21ca7ab94d549d2d0c541ec09f5d',
				name: 'Requisition Details',
				dependent: []
			},{
				uid: '21d18723fae447ef9f1e00f4c323e61a',
				permission: '21d18723fae447ef9f1e00f4c323e61a',
				name: 'Skills',
				dependent: [{
					uid: '1667e74599424c6db3ab8f8b8454808a',
					permission: '21d18723fae447ef9f1e00f4c323e61a',
					name: 'Skill Details',
					dependent: []
				}]
			}]
		}],
		forceLoad: false,
		sidebarFilter: 'E2E-',
		mainRecords: 0
	});
})();
