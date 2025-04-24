/**
 * Created by shen on 4/22/2023
 */

(function () {
	'use strict';
	let modName = 'procurement.common',
		cloudCommonModule = 'cloud.common',
		basicsCustomizeModule = 'basics.customize';

	angular.module(modName).factory('procurementCommonItem2PlantLayout', ['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
		return {
			'fid': 'procurement.common.detail',
			'version': '1.0.0',
			'addValidationAutomatically': true,
			'showGrouping': true,
			'groups': [
				{
					'gid': 'basicData',
					'attributes': ['plantfk', 'plantstatusfk','planttypefk', 'plantgroupfk']
				},
				{
					'gid': 'entityHistory',
					'isHistory': true
				}
			],
			'translationInfos': {
				'extraModules': [modName],
				'extraWords': {
					PlantFk: {location: modName, identifier: 'entityPlant', initial: 'Plant'},
					PlantStatusFk: {location: cloudCommonModule, identifier: 'Status', initial: 'Status'},
					PlantTypeFk: {location: basicsCustomizeModule, identifier: 'planttype'},
					PlantGroupFk: {location: basicsCustomizeModule, identifier: 'plantgroupfk', initial: 'Plant Group'}
				}
			},
			'overloads': {
				'plantfk': {
					grid: {
						editor: 'lookup',
						editorOptions: {
							directive: 'resource-equipment-plant-lookup-dialog-new',
							lookupOptions: {
								showClearButton: true,
								displayMember: 'Code',
								additionalColumns: true,
								addGridColumns: [{
									id: 'description',
									field: 'DescriptionInfo',
									name: 'Description',
									name$tr$: 'cloud.common.entityDescription',
									formatter: 'translation',
									readonly: true
								}]
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'equipmentPlant',
							displayMember: 'Code',
							version: 3
						}
					},
					detail: {
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'resource-equipment-plant-lookup-dialog-new',
							displayMember: 'Code',
							descriptionMember: 'DescriptionInfo.Translated',
							showClearButton: true
						}
					}
				},
				'plantstatusfk': basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.plantstatus'),
				'planttypefk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'basicsCustomizePantTypeLookupDataService'
				}),
				'plantgroupfk':  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'resourceEquipmentGroupLookupDataService',
					cacheEnable: true
				})
			}
		};
	}]);

	angular.module(modName).factory('procurementCommonItem2PlantUIStandardService',
		['platformUIStandardConfigService', 'procurementCommonTranslationService',
			'procurementCommonItem2PlantLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {

				let BaseService = platformUIStandardConfigService;

				let domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcItem2PlantDto',
					moduleSubModule: 'Procurement.Common'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				let service = new BaseService(layout, domainSchema, translationService);
				// override getStandardConfigForDetailView
				let basicGetStandardConfigForDetailView = service.getStandardConfigForDetailView;
				service.getStandardConfigForDetailView = function (){
					return angular.copy(basicGetStandardConfigForDetailView());
				};
				return service;
			}
		]);
})();
