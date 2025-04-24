(function () {
	'use strict';

	// --------------------------------------------------------
	// Logistic cardtemplate module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Cardtemplate',
		url: 'cardtemplate',
		mainEntity: 'Card Template',
		mainEntities: 'Card Templates',
		tile: 'logistic.cardtemplate',
		desktop: 'desktopcfg',
		container: [{
			uid: 'e0fffc91d92b4bdda85c9f39679f417c',
			permission: 'e0fffc91d92b4bdda85c9f39679f417c',
			name: 'Card Templates',
			dependent: [{
				uid: '29cad0ea85ce4611b194e118fb0c350f',
				permission: 'e0fffc91d92b4bdda85c9f39679f417c',
				name: 'Card Template Details',
				dependent: []
			},{
				uid: '0df6e4b981e146648d61eced666a6619',
				permission: '0df6e4b981e146648d61eced666a6619',
				name: 'Card Template Activities',
				dependent: [{
					uid: 'ef003b81dcd2411a8bad42476fb2bf87',
					permission: '0df6e4b981e146648d61eced666a6619',
					name: 'Card Template Activity Details',
					dependent: []
				},{
					uid: '8614a7a865cb43628c4056226bf5ca52',
					permission: '8614a7a865cb43628c4056226bf5ca52',
					name: 'Card Template Records',
					dependent: [{
						uid: 'c392eb6e54564b0da8a27a4e67876ea2',
						permission: '8614a7a865cb43628c4056226bf5ca52',
						name: 'Card Template Record Details',
						dependent: []
					}]
				}]
			},{
				uid: '25f9f55bcedb4093bf7c907d1b6c596c',
				permission: '25f9f55bcedb4093bf7c907d1b6c596c',
				name: 'Translation',
				dependent: []
			}]
		}],
		forceLoad: false,
		mainRecords: 0
	});
})();