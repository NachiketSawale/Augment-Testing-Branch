(function () {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantFixedAssetUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of plant fixed asset entities
	 */
	angular.module(moduleName).factory('resourceEquipmentPlantFixedAssetUIStandardService',
		['platformUIStandardConfigService', '$injector', 'resourceEquipmentTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',


			function (platformUIStandardConfigService, $injector, resourceEquipmentTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {
					return {
						fid: 'object.main.resourceequipmentplantfixedassetdetailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						addAdditionalColumns: true,
						showGrouping: true,
						groups: [
							{
								gid: 'basicData',
								attributes: [ 'companyfk', 'code', 'percentage', 'fixedassetfk', 'fixedasseturl', 'description', 'validfrom', 'validto' ]
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							fixedassetfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCustomFixedAssetLookupDataService',
								cacheEnable: true,
								additionalColumns: true,
							}),
							fixedasseturl: {
								readonly: true,
								maxLength: 2000,
								grid: {
									formatter: 'url'
								}
							},
							companyfk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-company-company-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'company',
										displayMember: 'Code'
									},
									width: 140
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'basics-company-company-lookup',
										descriptionMember: 'CompanyName',
										lookupOptions: {}
									}
								}
							}
						}
					};
				}

				var resourceEquipmentPlantFixedAssetDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var resourceEquipmentPlantFixedAssetAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'PlantFixedAssetDto',
					moduleSubModule: 'Resource.Equipment'
				});
				resourceEquipmentPlantFixedAssetAttributeDomains = resourceEquipmentPlantFixedAssetAttributeDomains.properties;


				function ResourceEquipmentPlantFixedAssetUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ResourceEquipmentPlantFixedAssetUIStandardService.prototype = Object.create(BaseService.prototype);
				ResourceEquipmentPlantFixedAssetUIStandardService.prototype.constructor = ResourceEquipmentPlantFixedAssetUIStandardService;

				return new BaseService(resourceEquipmentPlantFixedAssetDetailLayout, resourceEquipmentPlantFixedAssetAttributeDomains, resourceEquipmentTranslationService);
			}
		]);
})();
