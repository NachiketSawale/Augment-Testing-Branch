(function () {
	'use strict';
	var modName = 'basics.materialcatalog';

	angular.module(modName).value('basicsMaterialGroupCharLayout', {
		'fid': 'basics.materialCatalog.detail',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['propertyinfo', 'hasfixedvalues']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [],
			'extraWords': {
				PropertyInfo: { location: modName, identifier: 'property', initial: 'property' },
				Hasfixedvalues: { location: modName, identifier: 'hasFixedValues', initial: 'hasFixedValues' }
			}
		},
		'overloads': {
			'propertyinfo': {
				'mandatory': true
			},
			'hasfixedvalues': {
				'mandatory': true
			}
		}
	});

	angular.module(modName).factory('basicsMaterialCatalogGroupCharUIStandardService',
		['platformUIStandardConfigService', 'basicsMaterialcatalogTranslationService',
			'basicsMaterialGroupCharLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'MaterialGroupCharDto',
					moduleSubModule: 'Basics.MaterialCatalog'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				return new BaseService(layout, domainSchema, translationService);
			}
		]);
})();
