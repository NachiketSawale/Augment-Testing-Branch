(function () {
	'use strict';
	var moduleName = 'resource.equipment';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantAssignmentUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of plant assignment entities
	 */
	angular.module(moduleName).factory('resourceEquipmentPlantAssignmentUIStandardService',
		['platformUIStandardConfigService', '$injector', 'resourceEquipmentTranslationService', 'platformSchemaService', 'platformLayoutHelperService',

			function (platformUIStandardConfigService, $injector, resourceEquipmentTranslationService, platformSchemaService, platformLayoutHelperService) {

				function createMainDetailLayout() {
					var plantLookupOverload = platformLayoutHelperService.providePlantLookupOverload();
					platformLayoutHelperService.addConfigObjToLookupConfig(plantLookupOverload,{filterKey: 'equipment-plant-only-unassigned-filter'});
					return {
						fid: 'object.main.resourceequipmentplantassignmentdetailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						groups: [
							{
								'gid': 'basicData',
								'attributes': ['plant2fk', 'quantity', 'uomfk', 'commenttext']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						overloads: {
							uomfk: {
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										'directive': 'basics-lookupdata-uom-lookup'
									},
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'Uom',
										'displayMember': 'Unit'
									},
									'width': 100
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-uom-lookup'
								}
							},
							plant2fk: plantLookupOverload
						}
					};
				}

				var resourceEquipmentPlantAssignmentDetailLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var resourceEquipmentPlantAssignmentAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'PlantAssignmentDto',
					moduleSubModule: 'Resource.Equipment'
				});
				resourceEquipmentPlantAssignmentAttributeDomains = resourceEquipmentPlantAssignmentAttributeDomains.properties;


				function ResourceEquipmentPlantAssignmentUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ResourceEquipmentPlantAssignmentUIStandardService.prototype = Object.create(BaseService.prototype);
				ResourceEquipmentPlantAssignmentUIStandardService.prototype.constructor = ResourceEquipmentPlantAssignmentUIStandardService;

				return new BaseService(resourceEquipmentPlantAssignmentDetailLayout, resourceEquipmentPlantAssignmentAttributeDomains, resourceEquipmentTranslationService);
			}
		]);
})();
