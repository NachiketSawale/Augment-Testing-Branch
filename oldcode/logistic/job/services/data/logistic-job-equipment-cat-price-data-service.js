/**
 * Created by baf on 08.02.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.job');

	/**
	 * @ngdoc service
	 * @name logisticJobDataService
	 * @description pprovides methods to access, create and update logistic job  entities
	 */
	myModule.service('logisticJobEquipmentCatPriceDataService', LogisticJobEquipmentCatPriceDataService);

	LogisticJobEquipmentCatPriceDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'logisticJobDataService', 'basicsCommonMandatoryProcessor'];

	function LogisticJobEquipmentCatPriceDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	                                                 logisticJobDataService, mandatoryProcessor) {
		var self = this;
		var logisticJobServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticJobEquipmentCatPriceDataService',
				entityNameTranslationID: 'logistic.job.equipmentCatPriceListTitle',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/job/equipmentcatalogprice/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticJobDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'LogisticEquipmentCatalogPriceDto',
					moduleSubModule: 'Logistic.Job'
				})],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticJobDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'EquipmentCatPrices', parentService: logisticJobDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticJobServiceOption, self);
		serviceContainer.data.Initialised = true;
		
		serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'LogisticEquipmentCatalogPriceDto',
			moduleSubModule: 'Logistic.Job',
			validationService: 'logisticJobEquipmentCatPriceValidationService'
		});
	}
})(angular);
