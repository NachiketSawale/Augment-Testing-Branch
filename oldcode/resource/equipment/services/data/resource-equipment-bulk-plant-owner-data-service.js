/**
 * Created by nitsche on 04.02.2025
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let module = angular.module('resource.equipment');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentBulkPlantOwnerDataService
	 * @description provides methods to access, create and update Resource Equipment BulkPlantOwner entities
	 */
	module.service('resourceEquipmentBulkPlantOwnerDataService', ResourceEquipmentBulkPlantOwnerDataService);

	ResourceEquipmentBulkPlantOwnerDataService.$inject = [
		'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor',
		'resourceEquipmentConstantValues', 'resourceEquipmentPlantDataService', 'resourceEquipmentBulkPlantOwnerReadOnlyProcessor'
	];

	function ResourceEquipmentBulkPlantOwnerDataService(
		platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor,
		resourceEquipmentConstantValues, resourceEquipmentPlantDataService, resourceEquipmentBulkPlantOwnerReadOnlyProcessor
	) {
		let self = this;
		let resourceEquipmentServiceOption = {
			flatLeafItem: {
				module: module,
				serviceName: 'resourceEquipmentBulkPlantOwnerDataService',
				entityNameTranslationID: 'resource.equipment.resourceEquipmentEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/bulkplantowner/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData)
					{
						let selected = resourceEquipmentPlantDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false},
				dataProcessor: [
					platformDataServiceProcessDatesBySchemeExtension.createProcessor(resourceEquipmentConstantValues.schemes.bulkPlantOwner),
					resourceEquipmentBulkPlantOwnerReadOnlyProcessor
				],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData)
						{
							let selected = resourceEquipmentPlantDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'BulkPlantOwners', parentService: resourceEquipmentPlantDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(resourceEquipmentServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceEquipmentBulkPlantOwnerValidationService'
		}, resourceEquipmentConstantValues.schemes.bulkPlantOwner));
	}
})(angular);