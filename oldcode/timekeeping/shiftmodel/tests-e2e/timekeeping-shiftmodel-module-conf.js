(function () {
	'use strict';

	// --------------------------------------------------------
	// Timekeeping time module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Shift Model',
		url: 'shiftmodel',
		internalName: 'timekeeping.shiftmodel',
		mainEntity: 'Shift Model',
		mainEntities: 'Shift Models',
		tile: 'timekeeping.shiftmodel',
		desktop: 'desktopcfg',
		container: [{
			uid: 'c271fb74bb5c4e7dbfadc1222f1bb8ef',
			permission: 'c271fb74bb5c4e7dbfadc1222f1bb8ef',
			name: 'Shift Models',
			dependent: [{
				uid: '3f8b36e4b22441e7a994dd85e610567f',
				permission: 'c271fb74bb5c4e7dbfadc1222f1bb8ef',
				name: 'Shift Model Details',
				dependent: []
			}, {
				uid: '370d136ef46d4c13a7b3ce9bf8b1e5e4',
				permission: '370d136ef46d4c13a7b3ce9bf8b1e5e4',
				name: 'Working Times',
				dependent: [{
					uid: 'dd118689baf94608808fad8c942b565f',
					permission: '370d136ef46d4c13a7b3ce9bf8b1e5e4',
					name: 'Working Time Details',
					dependent: []
				}]
			}, {
				uid: 'f95528f5-1012-4a91-a619-5954d746ee60',
				permission: '63d97d8327c249cfa91e3eb4b426162c',
				name: 'ExceptionDays',
				dependent: [{
					uid: 'f95528f5-1012-4a91-a619-5954d746ee60',
					permission: '63d97d8327c249cfa91e3eb4b426162c',
					name: 'ExceptionDay Details',
					dependent: []
				}]
			}, {
				uid: 'c19bf3d2ae9f46aabbefe3d2b1e10758',
				permission: 'c19bf3d2ae9f46aabbefe3d2b1e10758',
				name: 'Translation',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 0
	});
})();