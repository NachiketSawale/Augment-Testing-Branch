/**
 * Created by cakiral on 07.04.2020
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.equipment');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantComponentMaintSchemaDataService
	 * @description pprovides methods to access, create and update resource equipment plantComponentMaintSchema entities
	 */
	myModule.service('resourceEquipmentPlantComponentMaintSchemaDataService', ResourceEquipmentPlantComponentMaintSchemaDataService);

	ResourceEquipmentPlantComponentMaintSchemaDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceEquipmentConstantValues', 'resourceEquipmentPlantComponentDataService','resourceEquipmentPlantComponentMaintSchemaReadOnlyProcessor'];

	function ResourceEquipmentPlantComponentMaintSchemaDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
															  basicsCommonMandatoryProcessor, resourceEquipmentConstantValues, resourceEquipmentPlantComponentDataService, resourceEquipmentPlantComponentMaintSchemaReadOnlyProcessor) {
		var self = this;
		var resourceEquipmentPlantComponentMaintSchemaServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceEquipmentPlantComponentMaintSchemaDataService',
				entityNameTranslationID: 'resourceEquipmentPlantComponentMaintSchemaEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/plantcomponentmaintschema/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceEquipmentPlantComponentDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceEquipmentConstantValues.schemes.plantComponentMaintSchema),
					resourceEquipmentPlantComponentMaintSchemaReadOnlyProcessor
				],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceEquipmentPlantComponentDataService.getSelected();
							creationData.PKey1 = selected.Id;
							creationData.PKey2 = selected.PlantFk;
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'PlantComponentMaintSchema',
						parentService: resourceEquipmentPlantComponentDataService
					}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceEquipmentPlantComponentMaintSchemaServiceOption, self);
		var service = serviceContainer.service;
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceEquipmentPlantComponentMaintSchemaValidationService'
		}, resourceEquipmentConstantValues.schemes.plantComponentMaintSchema));

		service.takeOverFromResourceEquipmentSidebarWizardCreateMaintenances =  function takeOverFromResourceEquipmentSidebarWizardCreateMaintenances (response) {

			_.forEach(response, function (CompoMaintSchemaEntity) {
				var viewCompoMaintSchema = serviceContainer.service.getItemById(CompoMaintSchemaEntity.Id);

				viewCompoMaintSchema.HasAllMaintenanceGenerated = CompoMaintSchemaEntity.HasAllMaintenanceGenerated;
				viewCompoMaintSchema.HasGeneratedMaintenance = CompoMaintSchemaEntity.HasGeneratedMaintenance;

				service.fireItemModified(viewCompoMaintSchema);


			});
		};



	}
})(angular);
