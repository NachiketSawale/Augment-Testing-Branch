(function(){
	'use strict';

	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;
	
	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Package',
		url: 'package',
		internalName: 'transportplanning.package',
		mainEntity: 'Package',
		mainEntities: 'Packages',
		tile: 'transportPlanning.package',
		desktop: 'desktop',
		container: [{
			uid: '9ade398dbcba41c79a9806e8250c49e6',
			permission: '9ade398dbcba41c79a9806e8250c49e6',
			name: 'Package List',
			dependent: [{
				uid: '6c185b145a70424c8675c4bbee3a46cc',
				permission: '9ade398dbcba41c79a9806e8250c49e6',
				name: 'Package Detail',
				dependent: []
			}, {
				uid: 'fb45491e56d64efc9a5d01a3763fa561',
				permission: '5d32c2debd3646ab8ef0457135d35624',
				name: 'Package: Event List',
				dependent: []
			}, {
				uid: 'a88b9bea40f1449aae7908582701686e',
				permission: '5640a72648e24f21bf3985624c4d0fdf',
				name: 'Package: Document List',
				dependent: [{
					uid: '4f183121967746b285ea361e691bf586',
					permission: '5640a72648e24f21bf3985624c4d0fdf',
					name: 'Package: Document Revisions',
					dependent: []
				}]
			}, {
				uid: '311ff7bb157947568ce1d33aca8d3650',
				permission: '311ff7bb157947568ce1d33aca8d3650',
				name: 'Translate',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 10
	});
})();
