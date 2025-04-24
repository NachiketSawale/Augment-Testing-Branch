/**
 * Created by baf on 06.02.2023
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.card');

	/**
	 * @ngdoc service
	 * @name logisticCardPlantCompatibleMaterialDataService
	 * @description pprovides methods to access, create and update logistic card plantCompatibleMaterial entities
	 */
	myModule.service('logisticCardPlantCompatibleMaterialDataService', LogisticCardPlantCompatibleMaterialDataService);

	LogisticCardPlantCompatibleMaterialDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticCardConstantValues', 'logisticCardDataService'];

	function LogisticCardPlantCompatibleMaterialDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticCardConstantValues, logisticCardDataService) {
		var self = this;
		var logisticCardPlantCompatibleMaterialServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticCardPlantCompatibleMaterialDataService',
				entityNameTranslationID: 'logistic.card.plantCompatibleMaterialEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'resource/equipment/compatiblematerial/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticCardDataService.getSelected();
						readData.PKey1 = 0;
						if(selected.PlantFk) {
							readData.PKey1 = selected.PlantFk;
						}
					}
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					logisticCardConstantValues.schemes.plantCompatibleMaterial)],
				actions: {delete: false, create: false },
				presenter: { list: { } },
				entityRole: {
					leaf: {itemName: 'PlantCompatibleMaterial', parentService: logisticCardDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticCardPlantCompatibleMaterialServiceOption, self);
		serviceContainer.data.Initialised = true;
	}
})(angular);
