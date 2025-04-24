/**
 * Created by baf on 20.07.2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	const myModule = angular.module('resource.equipmentgroup');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupSpecificValueDataService
	 * @description pprovides methods to access, create and update resource equipmentGroup specificValue entities
	 */
	myModule.service('resourceEquipmentGroupSpecificValueDataService', ResourceEquipmentGroupSpecificValueDataService);

	ResourceEquipmentGroupSpecificValueDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceEquipmentGroupConstantValues', 'resourceEquipmentGroupDataService', 'resourceEquipmentGroupSpecificValueReadOnlyProcessor'];

	function ResourceEquipmentGroupSpecificValueDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, resourceEquipmentGroupConstantValues, resourceEquipmentGroupDataService, resourceEquipmentGroupSpecificValueReadOnlyProcessor) {
		const self = this;
		const resourceEquipmentGroupSpecificValueServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceEquipmentGroupSpecificValueDataService',
				entityNameTranslationID: 'resource.equipmentgroup.specificValueEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipmentgroup/specificvalue/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = resourceEquipmentGroupDataService.getSelected();
						readData.PKey1 = selected.Id;
						readData.PKey2 = selected.EquipmentGroupFk;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceEquipmentGroupConstantValues.schemes.specificValue), resourceEquipmentGroupSpecificValueReadOnlyProcessor],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = resourceEquipmentGroupDataService.getSelected();
							creationData.PKey1 = selected.Id;
						},
						handleCreateSucceeded: function (newSpecValue) {
							let selected = resourceEquipmentGroupDataService.getSelected();
							if(selected && !selected.EquipmentGroupFk) {
								newSpecValue.IsAssignedToRoot = true;
							}
						}
					}
				},
				translation: {
					uid: 'resourceEquipmentGroupSpecificValueDataService',
					title: 'resource.equipmentgroup.specificValueEntity',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: resourceEquipmentGroupConstantValues.schemes.specificValue
				},
				entityRole: {
					leaf: {itemName: 'SpecificValues', parentService: resourceEquipmentGroupDataService}
				}
			}
		};

		const serviceContainer = platformDataServiceFactory.createService(resourceEquipmentGroupSpecificValueServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceEquipmentGroupSpecificValueValidationService'
		}, resourceEquipmentGroupConstantValues.schemes.specificValue));

		serviceContainer.service.canCreate = function canCreate() {
			let selected = resourceEquipmentGroupDataService.getSelected();

			return selected && !selected.EquipmentGroupFk;
		};
	}
})(angular);
