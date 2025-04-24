/**
 * Created by baf on 02.05.2019
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.equipmentgroup');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupControllingUnitDataService
	 * @description pprovides methods to access, create and update resource equipmentGroup controllingUnit entities
	 */
	myModule.service('resourceEquipmentGroupControllingUnitDataService', ResourceEquipmentGroupControllingUnitDataService);

	ResourceEquipmentGroupControllingUnitDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceEquipmentGroupConstantValues', 'resourceEquipmentGroupDataService'];

	function ResourceEquipmentGroupControllingUnitDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	                                                          basicsCommonMandatoryProcessor, resourceEquipmentGroupConstantValues, resourceEquipmentGroupDataService) {
		var self = this;
		var resourceEquipmentGroupControllingUnitServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceEquipmentGroupControllingUnitDataService',
				entityNameTranslationID: 'resource.equipmentgroup.controllingUnitEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipmentgroup/controllingunit/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceEquipmentGroupDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceEquipmentGroupConstantValues.schemes.groupControllingUnit)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceEquipmentGroupDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'ControllingUnits', parentService: resourceEquipmentGroupDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceEquipmentGroupControllingUnitServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceEquipmentGroupControllingUnitValidationService'
		}, resourceEquipmentGroupConstantValues.schemes.groupControllingUnit));
	}
})(angular);
