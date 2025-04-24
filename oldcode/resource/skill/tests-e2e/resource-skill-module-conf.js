(function () {
	'use strict';

	// --------------------------------------------------------
	// Resource skill module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Skill',
		url: 'skill',
		internalName: 'resource.skill',
		mainEntity: 'Skill',
		mainEntities: 'Skills',
		tile: 'resource-skills',
		desktop: 'desktopcfg',
		container: [{
			uid: '42e6d32d1ea343e5b0558a0394bfd3f7',
			permission: '42e6d32d1ea343e5b0558a0394bfd3f7',
			name: 'Skills',
			dependent: [{
				uid: 'c6c4abc54c5b432aa8cdee1b4b4030a3',
				permission: '42e6d32d1ea343e5b0558a0394bfd3f7',
				name: 'Skill Details',
				dependent: []
			},
			{
				uid: '0aa9dbc6d88744e2adc1d08e85e9361b',
				permission: '0aa9dbc6d88744e2adc1d08e85e9361b',
				name: 'Skill Chains',
				dependent: [{
					uid: '41057af6965043cfaab9bb267b239061',
					permission: '0aa9dbc6d88744e2adc1d08e85e9361b',
					name: 'Skill Chain Details',
					dependent: []
				}]
			},
			{
				uid: '8aa83e56e8c14c669871667de86c8557',
				permission: '8aa83e56e8c14c669871667de86c8557',
				name: 'Translation',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 4
	});
})();
