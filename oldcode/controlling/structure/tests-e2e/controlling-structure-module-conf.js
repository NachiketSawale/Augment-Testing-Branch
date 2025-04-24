(function() {
	'use strict';

	// controlling-structure module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Controlling Units',
		url: 'controlling',
		internalName: 'controlling.structure',
		mainEntity: 'Controlling Unit',
		mainEntities: 'Controlling Units',
		tile: 'controlling.structure',
		desktop: 'desktop',
		container: [{
			name: 'Projects',
			uid: '021c5211c099469bb35dcf68e6aebec7',
			dependent: [{
				name: 'Controlling Units',
				uid: '011cb0b627e448389850cdf372709f67',
				dependent: [{
					name: 'Controlling Unit Details',
					uid: '7d688de3485b440d92154d7c19f376f7',
					permission: '011cb0b627e448389850cdf372709f67'
				}, {
					name: 'Characteristics',
					uid: '64632455ab734d10986f71dd1cecd0ce'
				}, {
					name: 'Controlling Group Assignments',
					uid: '9e5b5809635c45de90e27a567ff6b0e9',
					dependent: [{
						name: 'Controlling Group Assignment Details',
						uid: '9832dabe9f3e4ee8bf3a0b3010e2122f',
						permission: '9e5b5809635c45de90e27a567ff6b0e9'
					}]
				}, {
					name: 'controlling.structure.containerTitleTranslation',
					uid: '9dcd60856ab34626963f5f6db332fb90'
				}]
			}, {
				name: 'PERT',
				uid: '41c98d824ff347d09f4dc697fdf9ee80'
			}]
		}],
		forceLoad: true,
		sidebarFilter: 'E2E-',
		mainRecords: 4
	});
})();
