(function() {
	'use strict';

	// --------------------------------------------------------
	// Customize Module Test Configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Customize',
		url: 'customize',
		internalName: 'basics.customize',
		tile: 'basics.customize',
		mainEntity: 'Data Type',
		mainEntities: 'Data Types',
		desktop: 'desktopcfg',
		container: [{
			uid: 'f5e884c670df4f938e51787e7cc40bf7',
			name: 'Data Types',
			permission: 'F5E884C670DF4F938E51787E7CC40BF7',
			dependent: [{
				uid: 'f79018066c4847a6b38ee99a6085dc9e',
				name: 'Translation',
				permission: 'F79018066C4847A6B38EE99A6085DC9E',
				dependent: []
			},{
				uid: 'ded0795b58b04ee58c1443d38d40fa2b',
				name: 'Type Documentation',
				permission: 'DED0795B58B04EE58C1443D38D40FA2B',
				dependent: []
			},{
				uid: '3a51bf834b8649069172d23ec1ba35e2',
				name: 'Data Records',
				permission: '3A51BF834B8649069172D23EC1BA35E2',
				dependent: []
			}]
		}],
		forceLoad: false,
		mainRecords: 596,
		brokenEntities: []
	});
})();
