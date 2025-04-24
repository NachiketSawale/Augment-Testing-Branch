(function () {
	'use strict';

	// --------------------------------------------------------
	// Basics userform module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Userform',
		url: 'userform',
		mainEntity: 'User Form',
		mainEntities: 'User Forms',
		tile: 'basics.userform',
		desktop: 'desktopcfg',
		container: [{
			uid: '093b912a666811e4b116123b93f75cba',
			permission: '093b912a666811e4b116123b93f75cba',
			name: 'User Forms',
			dependent: [{
				uid: 'fe81871fefa44373839de3d92fef6616',
				permission: '093b912a666811e4b116123b93f75cba',
				name: 'User Form Details',
				dependent: []
			},{
				uid: '19e14eb86a4e11e4b116123b93f75cba',
				permission: '093b912a666811e4b116123b93f75cba',
				name: 'Fields',
				dependent: []
			},{
				uid: '891fc10a6ef011e4b116123b93f75cba',
				permission: '891fc10a6ef011e4b116123b93f75cba',
				name: 'Formdata',
				dependent: []
			},{
				uid: '56339a49d96c4a018201d058a44762ac',
				permission: '56339a49d96c4a018201d058a44762ac',
				name: 'Language',
				dependent: []
			}]
		}],
		forceLoad: false,
		mainRecords: 0
	});
})();