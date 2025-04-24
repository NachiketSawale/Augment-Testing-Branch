(function () {
	'use strict';

	// --------------------------------------------------------
	// Basics regioncatalog module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Regioncatalog',
		url: 'regionCatalog',
		mainEntity: 'Region Type',
		mainEntities: 'Region Types',
		tile: 'basics.regioncatalog',
		desktop: 'desktopcfg',
		forceLoad: true,
		mainRecords: 2,
		container: [{
			uid: '4b02a602e9504978b271011ea1b4f42e',
			permission: '4b02a602e9504978b271011ea1b4f42e',
			name: 'Region Types',
			dependent: [{
				uid: 'bf11f19d012145d097e879ce5878e2dd',
				permission: '4b02a602e9504978b271011ea1b4f42e',
				name: 'Region Type Details',
				dependent: []
			},{
				uid: 'b3006840f41a4624a194bf52ddcfaae6',
				permission: 'b3006840f41a4624a194bf52ddcfaae6',
				name: 'Region Catalogs',
				dependent: [{
					uid: '45725aad31a34e44bb92d163a658ed7a',
					permission: 'b3006840f41a4624a194bf52ddcfaae6',
					name: 'Region Catalog Details',
					dependent: []
				}]
			},{
				uid: 'a0f71f8d3aca493498023807bedc7543',
				permission: 'a0f71f8d3aca493498023807bedc7543',
				name: 'Translation',
				dependent: []
			}]
		}]
	});
})();