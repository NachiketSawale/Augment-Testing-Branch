(function() {
	'use strict';

	// --------------------------------------------------------
	// Basics clerk module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Clerk',
		url: 'clerk',
		internalName: 'basics.clerk',
		mainEntity: 'Clerk',
		mainEntities: 'Clerks',
		tile: 'basics-clerk',
		desktop: 'desktopcfg',
		container: [{
			uid: 'f01193df20e34b8d917250ad17a433f1',
			permission: 'F01193DF20E34B8D917250AD17A433F1',
			name: 'Clerks',
			dependent: [{
				uid: '8b10861ea9564d60ba1a86be7e7da568',
				permission: 'F01193DF20E34B8D917250AD17A433F1',
				name: 'Clerk Details',
				dependent: []
			},
			{
				uid: 'dde598002bbf4a2d96c82dc927e3e578',
				permission: 'DDE598002BBF4A2D96C82DC927E3E578',
				name: 'Absences',
				dependent: [{
					uid: '6122eee3bf1a41ce994e0f1e5c165850',
					permission: 'DDE598002BBF4A2D96C82DC927E3E578',
					name: 'Absence Details',
					dependent: []
				}]
			},
			{
				uid: '880ec74c43cc4778b94cd26f1b6115e3',
				permission: '880ec74c43cc4778b94cd26f1b6115e3',
				name: 'Photo',
				dependent: []
			},
			{
				uid: '353a050190c24df1809a9005712b15c5',
				permission: '353a050190c24df1809a9005712b15c5',
				name: 'Email',
				dependent: []
			},
			{
				uid: 'e706ff9ebfe145d98270124f7727d174',
				permission: 'e706ff9ebfe145d98270124f7727d174',
				name: 'EMail Footer',
				dependent: []
			},
			{
				uid: 'c2dd899746024732aa0fc583526f04eb',
				permission: 'c2dd899746024732aa0fc583526f04eb',
				name: 'Characteristics',
				dependent: []
			},
			{
				uid: '82bb9ecf97e94aadab3d30f79cba2c02',
				permission: '82bb9ecf97e94aadab3d30f79cba2c02',
				name: 'Clerk Groups',
				dependent: [{
					uid: '008843fcaa8246faa41f620a0742b3ae',
					permission: '82bb9ecf97e94aadab3d30f79cba2c02',
					name: 'Clerk Group Details',
					dependent: []
				}]
			}
			]
		}],
		forceLoad: false,
		mainRecords: 0
	});
})();
