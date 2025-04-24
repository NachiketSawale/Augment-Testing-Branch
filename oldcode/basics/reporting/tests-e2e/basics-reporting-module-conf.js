(function () {
	'use strict';

	// --------------------------------------------------------
	// Basics reporting module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Reporting',
		url: 'reporting',
		mainEntity: 'Report',
		mainEntities: 'Reports',
		tile: 'basics.reporting',
		desktop: 'desktopcfg',
		forceLoad: true,
		mainRecords: 5,
		container: [{
			uid: '43fb6571d246461c9a079c1742085285',
			permission: '43fb6571d246461c9a079c1742085285',
			name: 'Reports',
			dependent: [{
				uid: 'a181c99848134b7bad86a51e84924f90',
				permission: '43fb6571d246461c9a079c1742085285',
				name: 'Report Details',
				dependent: []
			},{
				uid: 'b7816d465487426e8d2d97fa2831a3a4',
				permission: 'b7816d465487426e8d2d97fa2831a3a4',
				name: 'Translation',
				dependent: []
			},{
				uid: 'c846509f1b0345c1b7469e4fd56e11e7',
				permission: 'c846509f1b0345c1b7469e4fd56e11e7',
				name: 'Report Parameter',
				dependent: [{
					uid: 'eecedd9408434f51a6e99460453da724',
					permission: 'eecedd9408434f51a6e99460453da724',
					name: 'Report Parameter Values',
					dependent: []
				}]
			}]
		}]
	});
})();