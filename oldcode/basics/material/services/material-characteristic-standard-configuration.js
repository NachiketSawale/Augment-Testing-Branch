(function () {
	'use strict';
	var moduleName = 'basics.material';

	angular.module(moduleName).value('basicsMaterialCharacteristicLayout',
		{
			fid: 'basics.material.characteristic.detail',
			version: '1.0.0',
			addValidationAutomatically: true,
			showGrouping: true,
			translationInfos: {
				'extraModules': [],
				'extraWords': {
					PropertyDescription: {
						location: moduleName,
						identifier: 'characteristic.property',
						initial: 'Property'
					},
					CharacteristicDescription:{
						location: moduleName,
						identifier: 'characteristic.values',
						initial: 'Values'
					}
				}
			},
			groups: [
				{
					'gid': 'basicData',
					'attributes': ['propertydescription','characteristicdescription']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			overloads: {
				'propertyinfo': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-material-material-characteristic-lookup',
						'options': {
							showClearButton: true,
							isTextEditable: true,
							filterKey: 'material-property-filter',
							domain: 'translation'
						}
					},
					'grid': {
						editor: 'directive',
						editorOptions: {
							showClearButton: true,
							isTextEditable: true,
							filterKey: 'material-property-filter',
							directive: 'basics-material-material-characteristic-lookup',
							domain: 'description'
						}
					}
				},
				'characteristicinfo': {
					'detail': {
						'type': 'directive',
						'directive': 'basics-material-material-value-lookup',
						'options': {
							showClearButton: true,
							isTextEditable: true,
							lookupKey: 'basics-material-material-characteristic-characteristic',
							domain: 'translation'
						}
					},
					'grid': {
						editor: 'directive',
						editorOptions: {
							showClearButton: true,
							isTextEditable: true,
							lookupKey: 'basics-material-material-characteristic-characteristic',
							directive: 'basics-material-material-value-lookup',
							domain: 'description'
						}/*,
						formatter:'string',
						formatterOptions:{
							field:'characteristic'
						}*/
					}
				},
				'propertydescription':{
					'detail': {
						'type': 'directive',
						'directive': 'basics-material-material-characteristic-lookup',
						'options': {
							showClearButton: true,
							isTextEditable: true,
							filterKey: 'material-property-filter',
							//disMember:'entity.PropertyInfo',
							domain: 'description'
						}
					},
					'grid': {
						editor: 'directive',
						editorOptions: {
							showClearButton: true,
							isTextEditable: true,
							filterKey: 'material-property-filter',
							directive: 'basics-material-material-characteristic-lookup',
							//disMember:'entity.PropertyInfo',
							domain: 'description'
						}
					}
				 },
				 'characteristicdescription':{
					'detail': {
						'type': 'directive',
						'directive': 'basics-material-material-value-lookup',
						'options': {
							showClearButton: true,
							isTextEditable: true,
							lookupKey: 'basics-material-material-characteristic-characteristic',
							domain: 'description'
						}
					},
					'grid': {
						editor: 'directive',
						editorOptions: {
							showClearButton: true,
							isTextEditable: true,
							lookupKey: 'basics-material-material-characteristic-characteristic',
							directive: 'basics-material-material-value-lookup',
						}
					}
				  }
			}
		}
	);

	angular.module(moduleName).factory('basicsMaterialCharacteristicStandardConfigurationService',
		['platformUIStandardConfigService', 'basicsMaterialTranslationService',
			'basicsMaterialCharacteristicLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService,
			          layout, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;
				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'MaterialCharacteristicDto',
					moduleSubModule: 'Basics.Material'
				});

				function CharacteristicUIStandardService(layout, schema, translateService) {
					BaseService.call(this, layout, schema, translateService);
				}

				CharacteristicUIStandardService.prototype = Object.create(BaseService.prototype);
				CharacteristicUIStandardService.prototype.constructor = CharacteristicUIStandardService;

				return new CharacteristicUIStandardService(layout, domainSchema.properties, translationService);
			}
		]);
})();
