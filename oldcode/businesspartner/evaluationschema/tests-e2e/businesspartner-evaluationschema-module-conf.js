(function() {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global require,module */


	// --------------------------------------------------------
	// Basics bank module configuration
	let iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Evaluation Schema',
		url: 'evaluationschema',
		internalName: 'businesspartner.evaluationschema',
		mainEntity: 'Schema',
		mainEntities: 'Schemata',
		tile: 'businesspartner-evaluationschema',
		desktop: 'desktopcfg',
		container: [{
			uid: '6003e88eb8734da693f6fbb8dbee621e',
			permission: '6003E88EB8734DA693F6FBB8DBEE621E',
			name: 'Schemata',
			dependent: [{
				uid: 'ea75e48752624f3389ecc286ede0f763',
				permission: '6003E88EB8734DA693F6FBB8DBEE621E',
				name: 'Schema Details',
				dependent: []
			},{
				uid: 'd6320711b95d403199ad36bcc9b2be12',
				permission: 'D6320711B95D403199AD36BCC9B2BE12',
				name: 'Groups',
				dependent: [{
					uid: 'f89d0a40d28d475481656124683f757c',
					permission: 'D6320711B95D403199AD36BCC9B2BE12',
					name: 'Group Details',
					dependent: []
				},{
					uid: '25b798025ae0458eb34a5249101c428c',
					permission: '25B798025AE0458EB34A5249101C428C',
					name: 'Group Icons',
					dependent: [{
						uid: '84b6893d227c42c2ba2275b15ef12c78',
						permission: '25B798025AE0458EB34A5249101C428C',
						name: 'Group Icon Details',
						dependent: []
					}]
				},{
					uid: 'd252a6f857a84387a1e20abbc7db588b',
					permission: 'D252A6F857A84387A1E20ABBC7DB588B',
					name: 'Sub Groups',
					dependent: [{
						uid: '8d56ffa82e6144379648cf32d1a6d856',
						permission: 'D252A6F857A84387A1E20ABBC7DB588B',
						name: 'Group Icon Details',
						dependent: []
					},{
						uid: 'c57fbc4eb15844d0a29b6361bc131941',
						permission: 'C57FBC4EB15844D0A29B6361BC131941',
						name: 'Items',
						dependent: [{
							uid: '55c26aa6a9834f57b3089439ca49a6a6',
							permission: 'C57FBC4EB15844D0A29B6361BC131941',
							name: 'Item Details',
							dependent: []
						}]
					}]
				}]
			},{
				uid: '85e27c1f72d041f38215ee8478ce6ea3',
				permission: '85E27C1F72D041F38215EE8478CE6EA3',
				name: 'Schema Icons',
				dependent: [{
					uid: 'ff3d3400cc6949dcb9d55e09c6762062',
					permission: '85E27C1F72D041F38215EE8478CE6EA3',
					name: 'Schema Icon Details',
					dependent: []
				}]
			},{
				uid: 'f2593fd36ea84742b249f2b798fb9c30',
				permission: 'F2593FD36EA84742B249F2B798FB9C30',
				name: 'Translation',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 3
	});
})();
