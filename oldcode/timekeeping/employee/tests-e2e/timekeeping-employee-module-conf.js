(function () {
	'use strict';

	// --------------------------------------------------------
	// Timekeeping time module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Time Symbols',
		url: 'employee',
		internalName: 'timekeeping.employee',
		mainEntity: 'Employee',
		mainEntities: 'Employees',
		tile: 'timekeeping.employee',
		desktop: 'desktopcfg',
		container: [{
			uid: '3b47dae9be994a8c8aab95ca3aba7725',
			permission: '3b47dae9be994a8c8aab95ca3aba7725',
			name: 'Employees',
			dependent: [{
				uid: '6fa7a4435630483b8ffe16d6dbd3d17c',
				permission: '3b47dae9be994a8c8aab95ca3aba7725',
				name: 'Employee Details',
				dependent: []
			}, {
				uid: 'b89f95becdc44a84ba8cf3f32f2f06cf',
				permission: 'b89f95becdc44a84ba8cf3f32f2f06cf',
				name: 'Crew Assignments',
				dependent: [{
					uid: '0326e2061c0f45a790536a4741ec137c',
					permission: 'b89f95becdc44a84ba8cf3f32f2f06cf',
					name: 'Crew Assignment Details',
					dependent: []
				}]
			}, {
				uid: 'fdf3f45827f6410f8c89536f03982064',
				permission: 'fdf3f45827f6410f8c89536f03982064',
				name: 'Planned Absences',
				dependent: [{
					uid: '4933b71664ea4c4db200937bd6e39cdb',
					permission: 'fdf3f45827f6410f8c89536f03982064',
					name: 'Planned Absence Details',
					dependent: []
				}, {
					uid: '31f3f1c12e2346b08da6f668c26c9174',
					permission: '31f3f1c12e2346b08da6f668c26c9174',
					name: 'Translation',
					dependent: []
				}, {
					uid: 'cb717989d7494402a312e14f00974d51',
					permission: 'cb717989d7494402a312e14f00974d51',
					name: 'Pictures',
					dependent: []
				}, {
					uid: '14d107fb61184d6abb207033aef44e47',
					permission: 'cb717989d7494402a312e14f00974d51',
					name: 'Photos',
					dependent: []
				}, {
					uid: '726429485e844236bbc249a3982326fe',
					permission: '726429485e844236bbc249a3982326fe',
					name: 'Remark',
					dependent: []
				}, {
					uid: 'a0ce2e3271734b7db3e13b2b6c2ad44a',
					permission: 'a0ce2e3271734b7db3e13b2b6c2ad44a',
					name: 'Skills',
					dependent: [{
						uid: '3a0dc9c87b63405895bbe38caff26e0b',
						permission: 'a0ce2e3271734b7db3e13b2b6c2ad44a',
						name: 'Skill Details',
						dependent: []
					}]
				}]
			}]
		}],
		forceLoad: true,
		mainRecords: 0
	});
})();