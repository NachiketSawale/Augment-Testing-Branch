(function() {
	'use strict';

	// --------------------------------------------------------
	// Resource equipmentgroup module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Equipment Group',
		url: 'equipmentgroup',
		internalName: 'resource.equipmentgroup',
		mainEntity: 'Equipment Group',
		mainEntities: 'Equipment Groups',
		tile: 'resource-equipmentgroup',
		desktop: 'desktopcfg',
		container: [{
			uid: 'ec561557d8c14da28d7e98aa058acff9',
			permission: 'ec561557d8c14da28d7e98aa058acff9',
			name: 'Equipment Groups',
			dependent: [{
				uid: '855334f9234246f5840900e646fa0a1e',
				permission: 'ec561557d8c14da28d7e98aa058acff9',
				name: 'Equipment Group Details',
				dependent: []
			},
			{
				uid: '6b934bc7ecc544a7bcdce87b876b94a7',
				permission: '6b934bc7ecc544a7bcdce87b876b94a7',
				name: 'Characteristics',
				dependent: []
			},{
				uid: 'd7a7913fcf27457eb7db277790b7812e',
				permission: 'd7a7913fcf27457eb7db277790b7812e',
				name: 'Work Order Types',
				dependent: [{
					uid: '9355d63a6f0b4b9991f3e1f8532ceb41',
					permission: 'd7a7913fcf27457eb7db277790b7812e',
					name: 'Work Order Type Details',
					dependent: []
				}]
			},{
				uid: 'c686905455cf458fb299c40e0966c5b8',
				permission: 'c686905455cf458fb299c40e0966c5b8',
				name: 'Euro Lists',
				dependent: [{
					uid: '9c0779eb4dc7426988ca468f8bde4daa',
					permission: 'c686905455cf458fb299c40e0966c5b8',
					name: 'Euro List Details',
					dependent: []
				}]
			},{
				uid: 'aac8d525517c44d794c5ddd7cf406527',
				permission: 'aac8d525517c44d794c5ddd7cf406527',
				name: 'Price Lists',
				dependent: [{
					uid: '1b651939c6f74c3699a9ea9391d08db0',
					permission: 'aac8d525517c44d794c5ddd7cf406527',
					name: 'Price List Details',
					dependent: []
				}]
			},{
				uid: '73f7e2eea2a842dca95262d9e8832108',
				permission: '73f7e2eea2a842dca95262d9e8832108',
				name: 'Accounts',
				dependent: [{
					uid: 'e3cb4d24a11f4cdfbebd9e9c77ba9978',
					permission: '73f7e2eea2a842dca95262d9e8832108',
					name: 'Account Details',
					dependent: []
				}]
			},{
				uid: '91b78b592b5548cea31092fe04ed94bf',
				permission: '91b78b592b5548cea31092fe04ed94bf',
				name: 'Controlling Units',
				dependent: [{
					uid: 'a2190511a5de424e9f5514ac574ea0eb',
					permission: '91b78b592b5548cea31092fe04ed94bf',
					name: 'Controlling Unit Details',
					dependent: []
				}]
			}]
		}],
		forceLoad: true,
		sidebarFilter: 'E2E-',
		mainRecords: 2
	});
})();
