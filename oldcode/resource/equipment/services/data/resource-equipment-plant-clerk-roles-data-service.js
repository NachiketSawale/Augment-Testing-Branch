(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentPlantClerkRolesDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentPlantClerkRolesDataService is the data service for all plants related functionality.
	 */
	var moduleName= 'resource.equipment';
	var resourceModule = angular.module(moduleName);
	resourceModule.factory('resourceEquipmentPlantClerkRolesDataService', ['resourceEquipmentPlantDataService', 'platformDataServiceFactory',
		'platformDataServiceDataProcessorExtension', 'platformDataServiceProcessDatesBySchemeExtension','basicsCommonMandatoryProcessor','resourceEquipmentConstantValues',
		function (resourceEquipmentPlantDataService, platformDataServiceFactory, platformDataServiceDataProcessorExtension, platformDataServiceProcessDatesBySchemeExtension, basicsCommonMandatoryProcessor, resourceEquipmentConstantValues) {

			var factoryOptions = {
				flatNodeItem: {
					module: resourceModule,
					serviceName: 'resourceEquipmentPlantClerkRolesDataService',
					entityNameTranslationID: 'resource.equipment.entityResourceEquipmentPlantClerk',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'resource/equipment/plant2clerk/',
						endRead: 'listByParent',
						usePostForRead: true,
						initReadData: function initReadData(readData) {
							var selected = resourceEquipmentPlantDataService.getSelected();
							readData.PKey1 = selected.Id;
						}
					},
					actions: {delete: true, create: 'flat'},
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = resourceEquipmentPlantDataService.getSelected();
								creationData.PKey1 = selected.Id;
							}
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'Plant2ClerkDto',
						moduleSubModule: 'Resource.Equipment'
					}),
					],
					entityRole: {
						leaf: { itemName:'Plant2Clerk', parentService: resourceEquipmentPlantDataService}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);


			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
				validationService: 'resourceEquipmentPlantClerkRolesValidationDataService'
			}, resourceEquipmentConstantValues.schemes.plant2Clerk));


			return serviceContainer.service;
		}]);
})(angular);
