(function(){
	'use strict';

	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;
	
	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Bundle',
		url: 'bundle',
		internalName: 'transportplanning.bundle',
		mainEntity: 'Bundle',
		mainEntities: 'Bundles',
		tile: 'transportPlanning.bundle',
		desktop: 'desktop',
		container: [{
			uid: '95a65610f91042a5bb8995be789c2f15',
			permission: '8ea8679532ee44869df8dd9e3ae629de',
			name: 'Bundle List',
			dependent: [{
				uid: '1145ec1dabcd41b79568c44afdb0f3e0',
				permission: '8ea8679532ee44869df8dd9e3ae629de',
				name: 'Bundle Detail',
				dependent: []
			}, {
				uid: 'e73c63c80cbb44e7985a19c350405c5b',
				permission: '5d32c2debd3646ab8ef0457135d35624',
				name: 'Bundle: Events',
				dependent: []
			}, {
				uid: 'd8c96cdc54a840bfb7651c3228f19887',
				permission: 'd8c96cdc54a840bfb7651c3228f19887',
				name: 'Product List',
				dependent: [{
					uid: '1d2b2bf19d0d44b88539ccu58db79d18',
					permission: 'd8c96cdc54a840bfb7651c3228f19887',
					name: 'Product Detail',
					dependent: [{
						uid: '30f34f65c4054f6591d586173bdb9cb0',
						permission: '5d32c2debd3646ab8ef0457135d35624',
						name: 'Product: Events',
						dependent: []
					}]
				}]
			}, {
				uid: 'de53437040114c7288c516873abc8480',
				permission: '6540965b6c84450aa1da41fd1c870a47',
				name: 'Bundle: Resource Reservations',
				dependent: []
			}, {
				uid: '37b3dfb699784439870a4fc62aea515d',
				permission: '5640a72648e24f21bf3985624c4d0fdf',
				name: 'Bundle: Document List',
				dependent: [{
					uid: '470548fed53b4e79a3850d12af5fe78f',
					permission: '5640a72648e24f21bf3985624c4d0fdf',
					name: 'Bundle: Document Revision List',
					dependent: []
				}]
			}, {
				uid: '96f5cf010264456888ca1fcda1bca0bf',
				name: 'Translate',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 10
	});
})();
