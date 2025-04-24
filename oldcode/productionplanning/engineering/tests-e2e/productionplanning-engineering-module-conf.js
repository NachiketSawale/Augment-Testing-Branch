(function(){
	'use strict';

	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;
	
	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'engineering',
		url: 'engineering',
		internalName: 'productionplanning.engineering',
		mainEntity: 'engineering',
		mainEntities: 'engineerings',
		tile: 'productionPlanning.engineering',
		desktop: 'desktop',
		container: [{
			uid: 'a9d9591baf2d4e58b5d21cd8a6048dd1',
			permission: 'a9d9591baf2d4e58b5d21cd8a6048dd1',
			name: 'Task List',
			dependent: [{
				uid: 'eaf809020ac948a0b5cbb05f6bd4ed13',
				permission: 'a9d9591baf2d4e58b5d21cd8a6048dd1',
				name: 'Task Detail',
				dependent: []
			}, {
				uid: 'c14c16d0cab949eb96f10ab05bc2ccfe',
				permission: '4b3bf707e6ee44748685a142a57168b4',
				name: 'Product Description List',
				dependent: [{
					uid: 'd5a5827ede5241d5ab21e5f3d9429829',
					permission: '5640a72648e24f21bf3985624c4d0fdf',
					name: 'Product Description PPS Document List',
					dependent: [{
						uid: 'af8a5a1df29f42a6b86d1f990bada53a',
						permission: '5640a72648e24f21bf3985624c4d0fdf',
						name: 'Product Description PPS Document Revision List',
						dependent: []
					}]
				}]
			}, {
				uid: '054db6905e81420e9d848148e6bd1d2b',
				permission: '5640a72648e24f21bf3985624c4d0fdf',
				name: 'Task PPS Document List',
				dependent: [{
					uid: '0629bbb864524d6ba3cb9abf9b7dc19c',
					permission: '5640a72648e24f21bf3985624c4d0fdf',
					name: 'Task PPS Document Revision List',
					dependent: []
				}]
			}, {
				uid: 'd0c53c74153247fab30fc813f4c88b97',
				permission: '291a21ca7ab94d549d2d0c541ec09f5d',
				name: 'Resource Requisition List',
				dependent: []
			}, {
				uid: 'd7be5214139949ab886be48f0bffc6b8',
				permission: '6540965b6c84450aa1da41fd1c870a47',
				name: 'Resource Reservation List',
				dependent: []
			}, {
				uid: 'e50dba4dd0c443a2baf884a8d808bb63',
				permission: '5907fffe0f9b44588254c79a70ba3af1',
				name: 'PPS Item List',
				dependent: []
			}, {
				uid: 'a59ab35dbe5148c09013f5238706e942',
				permission: 'a9d9591baf2d4e58b5d21cd8a6048dd1',
				name: 'Project Location List',
				dependent: []
			},  {
				uid: '589ea017a55046bf95d957076c8a50be',
				permission: 'a9d9591baf2d4e58b5d21cd8a6048dd1',
				name: 'Activity List',
				dependent: []
			},  {
				uid: 'ddb676d112eb48a284dcb0b5d37f23b7',
				permission: 'a9d9591baf2d4e58b5d21cd8a6048dd1',
				name: 'Control Unit List',
				dependent: []
			}, {
				uid: '51440d12f85e490ba2b8b6e9b8969e7f',
				permission: '6540965b6c84450aa1da41fd1c870a47',
				name: 'Planning Board',
				dependent: []
			}, {
				uid: 'f1ceee23c5774036a1cceee9a7b34590',
				permission: 'f1ceee23c5774036a1cceee9a7b34590',
				name: 'Comment',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 10
	});
})();
