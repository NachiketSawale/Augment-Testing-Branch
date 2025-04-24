(function () {
	/* global module require */
	'use strict';

	// --------------------------------------------------------
	// Timekeeping recording module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Recording',
		url: 'recording',
		mainEntity: 'Recording',
		mainEntities: 'Recordings',
		tile: 'timekeeping.recording',
		desktop: 'desktopcfg',
		container: [{
			uid: '1682021f88cb489c9edb67fd77ba0500',
			permission: '1682021f88cb489c9edb67fd77ba0500',
			name: 'Recordings',
			dependent: [{
				uid: 'e252166b26c249da88abd3165e45e651',
				permission: '1682021f88cb489c9edb67fd77ba0500',
				name: 'Recording Details',
				dependent: []
			},{
				uid: 'a99560462228495790fa8a2cb66f3fe3',
				permission: 'a99560462228495790fa8a2cb66f3fe3',
				name: 'Sheets',
				dependent: [{
					uid: 'bc3f46599d584250baa1b35db1c361ad',
					permission: 'a99560462228495790fa8a2cb66f3fe3',
					name: 'Sheet Details',
					dependent: []
				},{
					uid: 'f78bcdebfebc494392a7759e48e6b0ed',
					permission: 'f78bcdebfebc494392a7759e48e6b0ed',
					name: 'Reports',
					dependent: [{
						uid: '9e6540d3c380465cb8e8c7afa0a2a98a',
						permission: 'f78bcdebfebc494392a7759e48e6b0ed',
						name: 'Report Details',
						dependent: []
					}]
				}]
			}]
		}],
		forceLoad: false,
		mainRecords: 0
	});
})();