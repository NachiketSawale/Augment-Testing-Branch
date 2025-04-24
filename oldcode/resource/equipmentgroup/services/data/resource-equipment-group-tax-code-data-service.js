/**
 * Created by cakiral on 03.02.2022
 */

(function (angular) {
	'use strict';
	let myModule = angular.module('resource.equipmentgroup');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupTaxCodeDataService
	 * @description provides methods to access, create and update Resource EquipmentGroup TaxCode entities
	 */
	myModule.service('resourceEquipmentGroupTaxCodeDataService', ResourceEquipmentGroupTaxCodeDataService);

	ResourceEquipmentGroupTaxCodeDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsCommonMandatoryProcessor', 'resourceEquipmentGroupDataService', 'resourceEquipmentGroupConstantValues'];

	function ResourceEquipmentGroupTaxCodeDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, resourceEquipmentGroupDataService, resourceEquipmentGroupConstantValues) {
		let self = this;
		let resourcePlantGroupServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceEquipmentGroupTaxCodeDataService',
				entityNameTranslationID: 'resource.equipment.resourceEquipmentGroupEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipmentgroup/taxcode/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let selected = resourceEquipmentGroupDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceEquipmentGroupConstantValues.schemes.taxCode)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							let selected = resourceEquipmentGroupDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'TaxCode', parentService: resourceEquipmentGroupDataService}
				}
			}
		};

		let serviceContainer = platformDataServiceFactory.createService(resourcePlantGroupServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceEquipmentGroupTaxCodeValidationService'
		}, resourceEquipmentGroupConstantValues.schemes.taxCode));
	}
})(angular);