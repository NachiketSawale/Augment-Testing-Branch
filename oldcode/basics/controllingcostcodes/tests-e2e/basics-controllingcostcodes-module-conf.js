(function () {
	'use strict';

	// --------------------------------------------------------
	// Basics controllingcostcodes module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Controllingcostcodes',
		url: 'controllingcostcodes',
		mainEntity: 'Controlling Costcode',
		mainEntities: 'Controlling Costcodes',
		tile: 'basics.controllingcostcodes',
		desktop: 'desktopcfg',
		container: [{
			uid: 'ec5c193f31594e03b340da66dc42cc17',
			permission: 'ec5c193f31594e03b340da66dc42cc17',
			name: 'Controlling Costcodes',
			dependent: [{
				uid: 'f45707e67df846dfaf61f8a0c76053d3',
				permission: 'ec5c193f31594e03b340da66dc42cc17',
				name: 'Controlling Costcode Details',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 2
	});
})();