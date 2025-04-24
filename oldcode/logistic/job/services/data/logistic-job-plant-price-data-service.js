/**
 * Created by leo on 12.03.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.job');

	/**
	 * @ngdoc service
	 * @name logisticJobPlantPriceDataService
	 * @description pprovides methods to access, create and update logistic job plant Price entities
	 */
	myModule.service('logisticJobPlantPriceDataService', LogisticJobPlantPriceDataService);

	LogisticJobPlantPriceDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'logisticJobDataService', 'basicsCommonMandatoryProcessor'];

	function LogisticJobPlantPriceDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, 
	                                          logisticJobDataService, mandatoryProcessor) {
		var self = this;
		var logisticJobPlantPriceServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticJobPlantPriceDataService',
				entityNameTranslationID: 'logistic.job.plantPriceListTitle',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/job/plantprice/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticJobDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'LogisticPlantPriceDto',
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
					leaf: {itemName: 'PlantPrices', parentService: logisticJobDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticJobPlantPriceServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'LogisticPlantPriceDto',
			moduleSubModule: 'Logistic.Job',
			validationService: 'logisticJobPlantPriceValidationService'
		});
	}
})(angular);
