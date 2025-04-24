(function(){
	'use strict';

	var iTwo40E2EConfigurator = require('rib-itwo40-e2e').configurator;
	
	module.exports = iTwo40E2EConfigurator.createBaseModuleConfiguration({
		name: 'PPSMaterial',
		url: 'ppsmaterial',
		internalName: 'productionplanning.ppsmaterial',
		mainEntity: 'PPSMaterial',
		mainEntities: 'PPSMaterials',
		tile: 'productionplanning.ppsmaterial',
		desktop: 'desktopcfg',
		container: [{
			uid: 'aa051ff3aecb4616824bd8ca6cfbbf4a',
			permission: 'aa051ff3aecb4616824bd8ca6cfbbf4a',
			name: 'Material Catalog',
			dependent: [{
				uid: 'bb5a7bda5ffa4ce7ac27655af85b66f4',
				permission: 'bb5a7bda5ffa4ce7ac27655af85b66f4',
				name: 'Material Group',
				dependent: []
			}, {
				uid: '1ed6d6955a20488e83c10c1c76326275',
				permission: '1ed6d6955a20488e83c10c1c76326275',
				name: 'PPS Material List',
				dependent: [{
					uid: 'ef4562bf23b54fcba3f84643bd64212c',
					permission: '1ed6d6955a20488e83c10c1c76326275',
					name: 'PPS Material Detail',
					dependent: []
				}, {
					uid: '211110394b224dd392b69c5b60fe4e80',
					permission: '211110394b224dd392b69c5b60fe4e80',
					name: 'Product Description Detail',
					dependent: [{
						uid: '3a0ff92d9fc74bc691845427bf566bd3',
						permission: '3a0ff92d9fc74bc691845427bf566bd3',
						name: 'Product Description Parameter List',
						dependent: []
					}]
				}, {
					uid: '43d8655f5b7b4357a3b3a7839ce7243b',
					permission: '43d8655f5b7b4357a3b3a7839ce7243b',
					name: 'Material Event Type List',
					dependent: [{
						uid: '0de5eadccc3f47d98ff39b2af6d6dd2c',
						permission: '43d8655f5b7b4357a3b3a7839ce7243b',
						name: 'Material Event Type Detail',
						dependent: []
					}]
				}, {
					uid: '5ea20e4b3d0f40399bbf006633500b26',
					permission: '5ea20e4b3d0f40399bbf006633500b26',
					name: 'PPS Event Type List',
					dependent: [{
						uid: 'de0bbc30b6954aec9ed0abf0c66b4130',
						permission: '5ea20e4b3d0f40399bbf006633500b26',
						name: 'PPS Event Type Detail',
						dependent: []
					}]
				}]
			}, {
				uid: 'e2839982fe5f4032b865401612a1611c',
				name: 'Translate',
				dependent: []
			}]
		}],
		forceLoad: true,
		mainRecords: 10
	});
})();
