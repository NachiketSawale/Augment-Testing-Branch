(function () {
	'use strict';

	// --------------------------------------------------------
	// boq-wic module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'WIC',
		url: 'wic',
		internalName: 'boq.wic',
		mainEntity: 'Workitem Group',
		mainEntities: 'Workitem Groups',
		tile: 'boq.wic',
		desktop: 'desktop',
		forceLoad: true,
		mainRecords: 5,
		container: [{
			uid: '8d40a6c7d21b49de9b80174a24588e34',
			permission: '8d40a6c7d21b49de9b80174a24588e34',
			name: 'Workitem Groups',
			dependent: [{
				uid: '34283f923ebc4d0e9cb3f33f6dafcad2',
				name: 'Workitem Group Details',
				permission: '8d40a6c7d21b49de9b80174a24588e34',
				dependent: []
			},
			{
				uid: '183d9175d8bd4742808e750670e16bd5',
				name: 'Translation',
				permission: '183d9175d8bd4742808e750670e16bd5',
				dependent: []
			},
			{
				uid: '5af92ad05fee4f02aaa80c67c1751380',
				name: 'WIC Catalogues',
				permission: '5af92ad05fee4f02aaa80c67c1751380',
				dependent: []
			}
			]
		}]
	});
})();
