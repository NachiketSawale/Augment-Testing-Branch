(function(){
	'use strict';

	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;
	
	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Transport Requisition',
		url: 'requisition',
		internalName: 'transportplanning.requisition',
		mainEntity: 'TransportRequisition',
		mainEntities: 'TransportRequisitions',
		tile: 'transportPlanning.requisition',
		desktop: 'desktop',
		container: [{
			uid: '67f457b1928342c4a65cee89c48693d0',
			permission: 'aaec6786820141e19c4b6febc691652b',
			name: 'Requisition List',
			dependent: [{
				uid: 'a613f788e4c146ae9b31e273d28ab86f',
				permission: 'aaec6786820141e19c4b6febc691652b',
				name: 'Requisition Detail',
				dependent: []
			}, {
				uid: '86d10992dc4e43fd8a3ccd1f395743bd',
				permission: '8ea8679532ee44869df8dd9e3ae629de',
				name: 'Requisition: Bundles',
				dependent: [{
					uid: 'b41a9a62c6a14d21bd9207a34cba1c29',
					permission: '8ea8679532ee44869df8dd9e3ae629de',
					name: 'Requisition: Bundle Detail',
					dependent: []
				}, {
					uid: '764f66b383ee4d28b5bde5994f35a446',
					permission: '5640a72648e24f21bf3985624c4d0fdf',
					name: 'Requisition: Bundle Document List',
					dependent: []
				}]
			}, {
				uid: 'b93c7cda7e5a4fb3b10fc25eef9679a2',
				permission: '8ea8679532ee44869df8dd9e3ae629de',
				name: 'Unassigned Bundle List',
				dependent: [{
					uid: '2b17169ff51446baa50b495894e57144',
					permission: '5640a72648e24f21bf3985624c4d0fdf',
					name: 'Unassigned Bundle: Documents',
					dependent: []
				}]
			}, {
				uid: 'a5b5c48b4a414325a8e0aba1f9ba3d47',
				permission: '291a21ca7ab94d549d2d0c541ec09f5d',
				name: 'Requisition: Resource Requisitions',
				dependent: []
			}, {
				uid: '318c8b9af84c4cb38086f897aa853d71',
				permission: '318c8b9af84c4cb38086f897aa853d71',
				name: 'Requisition: Material Requisitions',
				dependent: [{
					uid: '0d3a47d4ce5c45e3af881d47c95e0ef8',
					permission: '318c8b9af84c4cb38086f897aa853d71',
					name: 'Requisition: Material Requisition Detail',
					dependent: []
				}]
			}, {
				uid: '147e90100cf34aa9b66490a3433179f8',
				permission: 'aaec6786820141e19c4b6febc691652b',
				name: 'Site Filter',
				dependent: []
			}, {
				uid: 'd4185f9578db424b904ad5172333cf36',
				permission: 'aaec6786820141e19c4b6febc691652b',
				name: 'Generic Structure',
				dependent: []
			}, {
				uid: '96f5cf010264456888ca1fcda1bca0bf',
				permission: '96f5cf010264456888ca1fcda1bca0bf',
				name: 'Translate',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 10
	});
})();
