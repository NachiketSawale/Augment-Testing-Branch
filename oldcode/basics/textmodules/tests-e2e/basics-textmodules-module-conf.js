(function () {
	'use strict';

	// --------------------------------------------------------
	// Basics textmodules module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Textmodules',
		url: 'textmodules',
		mainEntity: 'Textmodule',
		mainEntities: 'Textmodules',
		tile: 'basics-text-modules',
		desktop: 'desktopcfg',
		container: [{
			uid: 'd4c817e7940a4a6a86472934b94ed186',
			permission: 'd4c817e7940a4a6a86472934b94ed186',
			name: 'Textmodules',
			dependent: [{
				uid: '57d62536ef764affb0230f12a2e666b9',
				permission: '57d62536ef764affb0230f12a2e666b9',
				name: 'Translation',
				dependent: []
			},{
				uid: 'ae10005200f94c4da0a555c33a1b78d9',
				permission: 'ae10005200f94c4da0a555c33a1b78d9',
				name: 'Specification',
				dependent: []
			},{
				uid: 'c938c695d85e44a4a13a1b6a82f83f0c',
				permission: 'c938c695d85e44a4a13a1b6a82f83f0c',
				name: 'Plain Text',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 2
	});
})();