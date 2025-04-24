/**
 * Created by cakiral on 23.07.2019
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('resource.equipment');

	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantCertificateDataService
	 * @description pprovides methods to access, create and update resource equipment plantCertificate entities
	 */
	myModule.service('resourceEquipmentPlantCertificateDataService', ResourceEquipmentPlantCertificateDataService);

	ResourceEquipmentPlantCertificateDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'resourceEquipmentConstantValues', 'resourceEquipmentPlantDataService'];

	function ResourceEquipmentPlantCertificateDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
														  basicsCommonMandatoryProcessor, resourceEquipmentConstantValues, resourceEquipmentPlantDataService) {
		var self = this;
		var resourceEquipmentPlantCertificateServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'resourceEquipmentPlantCertificateDataService',
				entityNameTranslationID: 'resource.equipment.entityPlantCertificate',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/plantCertificate/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = resourceEquipmentPlantDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					resourceEquipmentConstantValues.schemes.plantCertificate)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = resourceEquipmentPlantDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'Certificates', parentService: resourceEquipmentPlantDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(resourceEquipmentPlantCertificateServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'resourceEquipmentPlantCertificateValidationService'
		}, resourceEquipmentConstantValues.schemes.plantCertificate));
	}
})(angular);
