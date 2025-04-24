(function () {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantComponentUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of plant component entities
	 */
	angular.module(moduleName).factory('resourceEquipmentPlantComponentUIStandardService',
		['platformUIStandardConfigService', 'platformLayoutHelperService', '$injector', 'resourceEquipmentTranslationService', 'platformSchemaService', 'basicsLookupdataConfigGenerator',

			function (platformUIStandardConfigService, platformLayoutHelperService, $injector, resourceEquipmentTranslationService, platformSchemaService, basicsLookupdataConfigGenerator) {

				function createMainDetailLayout() {
					return {
						fid: 'object.main.resourceequipmentplantcomponentdetailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						addAdditionalColumns: true,
						showGrouping: true,
						groups: [
							{
								gid: 'basicData',
								attributes: [ 'plantcomponenttypefk', 'maintenanceschemafk', 'description', 'meterno', 'uomfk', 'endwarranty', 'validfrom', 'validto', 'commenttext', 'serialnumber','homeprojectfk','projectlocationfk','nextmaintperf','hasallmaintenancegenerated','nextmaintdate','nextmaintdays','nfcid']
							},
							{
								gid: 'userDefTextGroup',
								isUserDefText: true,
								attCount: 5,
								attName: 'userdefined'
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						overloads: {
							maintenanceschemafk:  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'resourceMaintenanceSchemaLookupDataService',
								filterKey: 'resource-equipment-component-maint-schema-filter'
							}),
							plantcomponenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('resource.componenttype.plantcomponenttype'),
							homeprojectfk: platformLayoutHelperService.provideProjectLookupOverload(),
							projectlocationfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({dataServiceName: 'projectLocationLookupDataService',
								filter: function (item) {
									let prj;
									if (item) {
										prj = item.HomeProjectFk;
									}
									return prj;
								}
							}),
							uomfk:{
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-lookupdata-uom-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'Uom',
										displayMember: 'Unit'
									},
									width: 100
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-uom-lookup'
								}
							},
						}
					};
				}

				var resourceEquipmentPlantComponentDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var resourceEquipmentPlantComponentAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'PlantComponentDto',
					moduleSubModule: 'Resource.Equipment'
				});
				resourceEquipmentPlantComponentAttributeDomains = resourceEquipmentPlantComponentAttributeDomains.properties;


				function ResourceEquipmentPlantComponentUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ResourceEquipmentPlantComponentUIStandardService.prototype = Object.create(BaseService.prototype);
				ResourceEquipmentPlantComponentUIStandardService.prototype.constructor = ResourceEquipmentPlantComponentUIStandardService;

				return new BaseService(resourceEquipmentPlantComponentDetailLayout, resourceEquipmentPlantComponentAttributeDomains, resourceEquipmentTranslationService);
			}
		]);
})();
