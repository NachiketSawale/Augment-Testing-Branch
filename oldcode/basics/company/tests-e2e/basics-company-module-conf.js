(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics company module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Company',
		url: 'company',
		internalName: 'basics.company',
		mainEntity: 'Company',
		mainEntities: 'Companies',
		tile: 'basics.company',
		desktop: 'desktopcfg',
		container: [{
			uid: '50593feea9fe4280b36f72e27c8dfda1',
			permission: '50593FEEA9FE4280B36F72E27C8DFDA1',
			name: 'Companies',
			dependent: [{
				uid: '44c2c0adb0c9408fb873b8c395aa5e08',
				permission: '50593FEEA9FE4280B36F72E27C8DFDA1',
				name: 'Company Details',
				dependent: []
			},
			{
				uid: 'd006ffc4e4764cf68e2df6865dc5f04e',
				permission: 'D006FFC4E4764CF68E2DF6865DC5F04E',
				name: 'Categories',
				dependent: [{
					uid: 'e8b8b6571fe64c90925a0fc49486ac64',
					permission: 'D006FFC4E4764CF68E2DF6865DC5F04E',
					name: 'Category Details',
					dependent: []
				}]
			},
			{
				uid: 'e94283e1a1764bd1aef87344095773fa',
				permission: 'E94283E1A1764BD1AEF87344095773FA',
				name: 'Text Modules',
				dependent: [{
					uid: 'b22a1b0792e44782848001641da08ceb',
					permission: 'E94283E1A1764BD1AEF87344095773FA',
					name: 'Text Module Details',
					dependent: []
				}]
			},
			{
				uid: '1ed887bec41f43cea694ada8c4c25254',
				permission: '1ED887BEC41F43CEA694ADA8C4C25254',
				name: 'Clerks',
				dependent: [{
					uid: '0a559d46ddd94140832c7e36e2adbf0f',
					permission: '1ED887BEC41F43CEA694ADA8C4C25254',
					name: 'Clerk Details',
					dependent: []
				}]
			},
			{
				uid: '041f24c6d4b34c0b9c56869b2b4d9e46',
				permission: '041F24C6D4B34C0B9C56869B2B4D9E46',
				name: 'Surcharges',
				dependent: [{
					uid: 'fadeac1901cc49589626297a0ee5cd42',
					permission: '041F24C6D4B34C0B9C56869B2B4D9E46',
					name: 'Surcharge Details',
					dependent: []
				}]
			},
			{
				uid: 'b13485c47de64239b64a9d573e03aba4',
				permission: 'B13485C47DE64239B64A9D573E03ABA4',
				name: 'Business Years',
				dependent: [{
					uid: '268efaf3c6a6485eb1bb03a6d989ef43',
					permission: 'B13485C47DE64239B64A9D573E03ABA4',
					name: 'Business Year Details',
					dependent: []
				},{
					uid: 'ec18c54522aa46fe9848f466875aa03c',
					permission: 'EC18C54522AA46FE9848F466875AA03C',
					name: 'Periods',
					dependent: [{
						uid: '0d38d21d14d8475c9206c3eb346f63be',
						permission: 'EC18C54522AA46FE9848F466875AA03C',
						name: 'Period Details',
						dependent: []
					},{
						uid: '4b65cdfbf33b45e683d06779a5e05574',
						permission: '4b65cdfbf33b45e683d06779a5e05574',
						name: 'Transheaders',
						dependent: [{
							uid: 'a7f63cb15a8e4820a0dd673e457360c6',
							permission: '4b65cdfbf33b45e683d06779a5e05574',
							name: 'Transheader Details',
							dependent: []
						},{
							uid: 'a47073dd69804cd2947d6a218433f6fb',
							permission: 'a47073dd69804cd2947d6a218433f6fb',
							name: 'Transactions',
							dependent: [{
								uid: 'd8758247b1a1461b8bf7d801bf019863',
								permission: 'a47073dd69804cd2947d6a218433f6fb',
								name: 'Transaction Details',
								dependent: []
							}]
						}]
					}]
				}]
			},
			{
				uid: '96a56c8c643e4acd910777043b76fe4d',
				permission: '96A56C8C643E4ACD910777043B76FE4D',
				name: 'Number Generation',
				dependent: []
			},
			{
				uid: 'a7289b1bd354459fbca08be7cce8929e',
				permission: 'A7289B1BD354459FBCA08BE7CCE8929E',
				name: 'Logo',
				dependent: []
			},
			{
				uid: '3a382146ed2840508a5d93baa32aa24d',
				permission: '3A382146ED2840508A5d93BAA32AA24D',
				name: 'Letter Head',
				dependent: []
				},
			{
				uid: 'd61ab24bcd2b4985a86d129e1a172747',
				permission: 'd61ab24bcd2b4985a86d129e1a172747',
				name: 'Company Urls',
				dependent: [{
					uid: '94bdf16eaa544517805a0c02a9d584b4',
					permission: 'd61ab24bcd2b4985a86d129e1a172747',
					name: 'Company Url Details',
					dependent: []
				}]
			},
			{
				uid: 'a6c699f919384122bcce8540f67602c1',
				permission: 'a6c699f919384122bcce8540f67602c1',
				noCreateDelete: true,
				name: 'Utilisable Groups',
				dependent: [{
					uid: '76063ce5e89f4c9bbb571b1c431244bc',
					permission: 'a6c699f919384122bcce8540f67602c1',
					name: 'Utilisable Group Details',
					dependent: []
				}]
			},{
					uid: 'd2e263bf9a1240f3bcf041c4fcad67dc',
					permission: 'd2e263bf9a1240f3bcf041c4fcad67dc',
					name: 'Deferral Types',
					dependent: [{
						uid: '29f12eb12f6f4f639569f812c24cc282',
						permission: 'd2e263bf9a1240f3bcf041c4fcad67dc',
						name: 'Deferral Type Details',
						dependent: []
					}]
				},{
				uid: '162414311ae94f1a9e0d92d9ff731ec1',
				permission: '162414311ae94f1a9e0d92d9ff731ec1',
				name: 'Translation',
				dependent: []
			},{
				uid: '53ce3acd0703462abe01e899b4b9c4fa',
				permission: '53ce3acd0703462abe01e899b4b9c4fa',
				noCreateDelete: true,
				name: 'Access Role Assignments',
				dependent: [{
					uid: '26a0309eaa0843ccab4eb2f60c1ac508',
					permission: '53ce3acd0703462abe01e899b4b9c4fa',
					name: 'Access Role Assignment Details',
					dependent: []
				}]
			},{
					uid: '60355de3d08848ebaadf73aaeac28f92',
					permission: '60355de3d08848ebaadf73aaeac28f92',
					name: 'Clerks and Roles',
					dependent: [{
						uid: 'd6f4fc0fb41f43e48bcb8976961f5339',
						permission: '60355de3d08848ebaadf73aaeac28f92',
						name: 'Clerk and Role Details',
						dependent: []
					}]
				},
				{
					uid: '8b6b2f1cef2a41ba87cbfd161a0225c8',
					permission: '8b6b2f1cef2a41ba87cbfd161a0225c8',
					name: 'Characteristics',
					dependent: []
				},{
					uid: 'bc9dee680be8436591036d1438c11296',
					permission: 'bc9dee680be8436591036d1438c11296',
					name: 'Creditors',
					dependent: [{
						uid: 'f419dce401ca4f378598eec59b296b63',
						permission: 'bc9dee680be8436591036d1438c11296',
						name: 'Creditor Details',
						dependent: []
					}]
				},{
					uid: '21ea54ddccde46cea63aeaa86eb82b1b',
					permission: '21ea54ddccde46cea63aeaa86eb82b1b',
					name: 'Debtors',
					dependent: [{
						uid: '3dac85c30d4c468c9678d9f010a8501a',
						permission: '21ea54ddccde46cea63aeaa86eb82b1b',
						name: 'Debtor Details',
						dependent: []
					}]
				},{
					uid: 'fad2f7ae9ac24fffa884a5245d4e8d18',
					permission: 'fad2f7ae9ac24fffa884a5245d4e8d18',
					name: 'Timekeeping Groups',
					dependent: [{
						uid: '818c680483854e4f9ec50a71203cd49d',
						permission: 'fad2f7ae9ac24fffa884a5245d4e8d18',
						name: 'Timekeeping Group Details',
						dependent: []
					}]
				}
			]
		}],
		forceLoad: true,
		sidebarFilter: 'E2E-',
		mainRecords: 2
	});
})();
