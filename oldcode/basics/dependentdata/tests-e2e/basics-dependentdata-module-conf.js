(function () {
	'use strict';

	// --------------------------------------------------------
	// Basics dependentdata module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Dependentdata',
		url: 'dependentdata',
		mainEntity: 'User Container',
		mainEntities: 'User Container',
		tile: 'basics.dependentdata',
		desktop: 'desktopcfg',
		container: [{
			uid: '9ea72ac6d3884be582b2e6507987b9d2',
			permission: '9ea72ac6d3884be582b2e6507987b9d2',
			name: 'User Container',
			dependent: [{
				uid: '369ffe77b01f4910bf302fb001c50398',
				permission: '9ea72ac6d3884be582b2e6507987b9d2',
				name: 'User Container Details',
				dependent: []
			},{
				uid: 'ac74931e5d124f8faefee74e490af726',
				permission: 'ac74931e5d124f8faefee74e490af726',
				name: 'Data Columns',
				dependent: []
			},{
				uid: '7fb114adecdf41d999ab7e3a1359e463',
				permission: '7fb114adecdf41d999ab7e3a1359e463',
				name: 'Translation',
				dependent: []
			},{
				uid: '38dd62eae5544544905d10d0b9bef0c3',
				permission: '38dd62eae5544544905d10d0b9bef0c3',
				name: 'Data Charts',
				dependent: [{
					uid: '2c46c63d1eef4f68aaa749ebdd08e18c',
					permission: '38dd62eae5544544905d10d0b9bef0c3',
					name: 'Data Chart Details',
					dependent: []
				},{
					uid: '6f7ae102f33c4b62b46ebd0fb64bc879',
					permission: '38dd62eae5544544905d10d0b9bef0c3',
					name: 'Chart Series',
					dependent: [{
						uid: 'd549130037ec4296920673b626f8eecd',
						permission: '38dd62eae5544544905d10d0b9bef0c3',
						name: 'Chart Series Details',
						dependent: []
					}]
				}]
			}]
		}],
		forceLoad: true,
		mainRecords: 2
	});
})();