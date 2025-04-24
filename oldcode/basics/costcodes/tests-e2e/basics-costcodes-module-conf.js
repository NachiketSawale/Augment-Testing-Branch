(function () {
	'use strict';

	// --------------------------------------------------------
	// Basics costcodes module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Cost codes',
		url: 'costcodes',
		internalName: 'basics.costcodes',
		mainEntity: 'Cost Code',
		mainEntities: 'Cost Codes',
		tile: 'basics.costcodes',
		desktop: 'desktopcfg',
		container: [{
			uid: 'ceeb3a8d7f3e41aba9aa126c7a802f87',
			permission: 'CEEB3A8D7F3E41ABA9AA126C7A802F87',
			name: 'Cost Codes',
			dependent: [{
				uid: 'ef116ab75a4246bf98055f17833c6db1',
				permission: 'CEEB3A8D7F3E41ABA9AA126C7A802F87',
				name: 'Cost Code Details',
				dependent: []
			},{
				uid: '70d04bf9abd64349a824f0f452ce0ac4',
				permission: '70d04bf9abd64349a824f0f452ce0ac4',
				name: 'Translation',
				dependent: []
			},{
				uid: 'dc72e4cf73694079a9856076bffe5731',
				permission: 'dc72e4cf73694079a9856076bffe5731',
				name: 'Characteristics',
				dependent: []
			},{
				uid: 'b0f893daa2e142489a24fb0e34546897',
				permission: 'b0f893daa2e142489a24fb0e34546897',
				name: 'Price Versions',
				dependent: [{
					uid: 'b4dce598c1d9439896381fa36c7a3b2d',
					permission: 'b0f893daa2e142489a24fb0e34546897',
					name: 'Price Version Details',
					dependent: []
					},{
					uid: 'bbc1b97341f84baf931f3d2bda0e7111',
					permission: 'bbc1b97341f84baf931f3d2bda0e7111',
					name: 'Price Version Records',
					dependent: [{
						uid: '415a3fb901b2437a8634e5d2e44a3df6',
						permission: 'bbc1b97341f84baf931f3d2bda0e7111',
						name: 'Price Version Record Details',
						dependent: []
					}]
				}]
			},{
				uid: '5401b0a75aeb4a259f442a9f13b7dc1a',
				permission: 'CEEB3A8D7F3E41ABA9AA126C7A802F87',
				name: 'Cost Codes 2 Companies',
				dependent: []
			},{
				uid: '905c3e42678d4789918e6d9360c80cbc',
				permission: '905c3e42678d4789918e6d9360c80cbc',
				name: 'Price Versions 2 Company',
				dependent: []
			},{
				uid: 'b2a5ef0b5b574a03935b31251ce33275',
				permission: 'CEEB3A8D7F3E41ABA9AA126C7A802F87',
				name: 'Cost Codes 2 Resources Types',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 2
	});
})();
