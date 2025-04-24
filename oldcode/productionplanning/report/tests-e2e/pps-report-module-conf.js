(function(){
	'use strict';

	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;
	
	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Report',
		url: 'report',
		mainEntity: 'Report',
		mainEntities: 'Reports',
		tile: 'productionPlanning.report',
		desktop: 'desktop',
		container: [{
			uid: 'a17a58e59a944f95ae9e0c7f627c9e1a',
			permission: 'a17a58e59a944f95ae9e0c7f627c9e1a',
			name: 'Report List',
			dependent: [{
				uid: 'f32ffb6f21d34c7ab7aca13882ec61fe',
				permission: 'a17a58e59a944f95ae9e0c7f627c9e1a',
				name: 'Report Detail',
				dependent: []
			}, {
				uid: 'af02d448a61b4e048dc76d7cedf76bfa',
				permission: 'af02d448a61b4e048dc76d7cedf76bfa',
				name: 'Report: Products',
				dependent: []
			}, {
				uid: 'f690bd4b069d48cc995447dc5776899d',
				permission: 'f690bd4b069d48cc995447dc5776899d',
				name: 'Time Sheet List',
				dependent: [{
					uid: 'dc2aa594192c407e966c368a3c7791cc',
					permission: 'f690bd4b069d48cc995447dc5776899d',
					name: 'Time Sheet Detail',
					dependent: []
				}]
			}, {
				uid: '187a17f9e2ca468a9d2cab369d28e4bf',
				permission: '187a17f9e2ca468a9d2cab369d28e4bf',
				name: 'Report: Cost Codes',
				dependent: [{
					uid: '504a75f8108c459eb85c9e3217cd5159',
					permission: '187a17f9e2ca468a9d2cab369d28e4bf',
					name: 'Report: Cost Code Detail',
					dependent: []
				}]
			}, {
				uid: '72366c321e554a7d86da04e8fc996047',
				permission: '5640a72648e24f21bf3985624c4d0fdf',
				name: 'Report: Documents',
				dependent: [{
					uid: '57e6dd200e26447eaf69c2efd2e9ca97',
					permission: '5640a72648e24f21bf3985624c4d0fdf',
					name: 'Report: Document Revision',
					dependent: []
				}]
			}, {
				uid: '5abcc2c46f8c4427a9d743fc5f2f1bd8',
				name: 'Translate',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 10
	});
})();