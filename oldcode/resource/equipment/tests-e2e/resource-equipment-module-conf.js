(function() {
	'use strict';

	// --------------------------------------------------------
	// Resource equipment module configuration
	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;

	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'Equipment',
		url: 'equipment',
		internalName: 'resource.equipment',
		mainEntity: 'Plant',
		mainEntities: 'Plants',
		tile: 'resource-equipment',
		desktop: 'desktopcfg',
		container: [{
			uid: 'b71b610f564c40ed81dfe5d853bf5fe8',
			permission: 'b71b610f564c40ed81dfe5d853bf5fe8',
			name: 'Plants',
			dependent: [{
				uid: '14744d2f5e004676abfefd1329b6beff',
				permission: 'b71b610f564c40ed81dfe5d853bf5fe8',
				name: 'Plant Details',
				dependent: []
			},
			{
				uid: 'b46a50394062485b9c0f5ddabf9a1b01',
				permission: 'b46a50394062485b9c0f5ddabf9a1b01',
				name: 'Fixed Assets',
				dependent: [{
					uid: 'e85c0d0ed4dd46f2b36f55e9ba8376da',
					permission: 'b46a50394062485b9c0f5ddabf9a1b01',
					name: 'Fixed Asset Details',
					dependent: []
				}]
			},
			{
				uid: 'f0e92216d80d4f9892c0d591cfd93a06',
				permission: 'f0e92216d80d4f9892c0d591cfd93a06',
				name: 'Documents',
				dependent: [{
					uid: 'b364e4d2d3e7438cacfb320e3c8e93d9',
					permission: 'f0e92216d80d4f9892c0d591cfd93a06',
					name: 'Document Details',
					dependent: []
				}]
			},
			{
				uid: 'c84bcfcbcb3f41eca885db0e9a08f179',
				permission: 'c84bcfcbcb3f41eca885db0e9a08f179',
				name: 'Business Partners',
				dependent: [{
					uid: '442c8df8e82346ae942d9c50fc495bb7',
					permission: 'c84bcfcbcb3f41eca885db0e9a08f179',
					name: 'Business Partner Details',
					dependent: []
				}]
			},
			{
				uid: 'c8814c5d27b54f60827f48112dc1fc57',
				permission: 'c8814c5d27b54f60827f48112dc1fc57',
				name: 'Plant Accessories',
				dependent: [{
					uid: 'd5a69c4da56845f2b5420016f4fc0de3',
					permission: 'c8814c5d27b54f60827f48112dc1fc57',
					name: 'Plant Accessory Details',
					dependent: []
				}]
			},
			{
				uid: 'eebaa9c4e6c747b3b6fb477d8e285d69',
				permission: 'eebaa9c4e6c747b3b6fb477d8e285d69',
				name: 'Photos',
				dependent: [{
					uid: 'a5cde9dbb48f4319a0bc937faf31bdd9',
					permission: 'eebaa9c4e6c747b3b6fb477d8e285d69',
					name: 'Photo View',
					dependent: []
				}]
			},
			{
				uid: 'dd49d6ac8e844f50b8411e50e31caea8',
				permission: 'dd49d6ac8e844f50b8411e50e31caea8',
				name: 'Assignments',
				dependent: [{
					uid: 'dd1bbd6ab5c949d998665092a5c583d9',
					permission: 'dd49d6ac8e844f50b8411e50e31caea8',
					name: 'Assignment Details',
					dependent: []
				}]
			},
			{
				uid: '9f4ef6e2ff6d403fbb24f760c0c5fb70',
				permission: '9f4ef6e2ff6d403fbb24f760c0c5fb70',
				name: 'Components',
				dependent: [{
					uid: '5f0e8f1e8d5142b099cc5fb4aabd26fa',
					permission: '9f4ef6e2ff6d403fbb24f760c0c5fb70',
					name: 'Component Details',
					dependent: []
				}]
			},
			{
				uid: 'c779f23a59854b0c9c9960044319d8a4',
				permission: 'c779f23a59854b0c9c9960044319d8a4',
				name: 'Eurolists',
				dependent: [{
					uid: '2dd482ff9dd043209388b267dd278a83',
					permission: 'c779f23a59854b0c9c9960044319d8a4',
					name: 'Eurolist Details',
					dependent: []
				}]
			},
			{
				uid: '90ae201df9584e09b26c8b091635fa7e',
				permission: '90ae201df9584e09b26c8b091635fa7e',
				name: 'Comments',
				dependent: []
			},
			{
				uid: '519cb47956cc446ba4735bb95d000775',
				permission: '519cb47956cc446ba4735bb95d000775',
				name: 'Translation',
				dependent: []
			},
			{
				uid: '2bf921a9d13840bbb9f2b893d109fbdd',
				permission: '2bf921a9d13840bbb9f2b893d109fbdd',
				name: 'Characteristics',
				dependent: []
			},
			{
				uid: '2e0de4514e1e4873b5c650edbe6f2c41',
				permission: '2e0de4514e1e4873b5c650edbe6f2c41',
				name: 'Pricelists',
				dependent: [{
					uid: '2d915e6ca9db4c4ba1d03bb09c3aea0e',
					permission: '2e0de4514e1e4873b5c650edbe6f2c41',
					name: 'Pricelist Details',
					dependent: []
				}]
			},
			{
				uid: 'af1dcf780b1b49c48857b990b455ac3c',
				permission: 'af1dcf780b1b49c48857b990b455ac3c',
				name: 'Maintenance',
				dependent: [{
					uid: '76ea5f472fa14838915bad3b76e64f43',
					permission: 'af1dcf780b1b49c48857b990b455ac3c',
					name: 'Maintenance Details',
					dependent: []
				}]
			}
			]
		}],
		forceLoad: false,
		sidebarFilter: 'E2E-',
		mainRecords: 0
	});
})();
