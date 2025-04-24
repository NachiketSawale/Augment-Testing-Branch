/**
 * Created by baf on 08.02.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.job');

	/**
	 * @ngdoc service
	 * @name logisticJobMaterialRateDataService
	 * @description pprovides methods to access, create and update logistic job Material Rate entities
	 */
	myModule.service('logisticJobMaterialRateDataService', LogisticJobMaterialRateDataService);

	LogisticJobMaterialRateDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticJobMaterialCatPriceDataService'];

	function LogisticJobMaterialRateDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	                                            mandatoryProcessor, logisticJobMaterialCatPriceDataService) {
		var self = this;
		var logisticJobMaterialRateServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticJobMaterialRateDataService',
				entityNameTranslationID: 'logistic.job.materialRateListTitle',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/job/materialrate/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticJobMaterialCatPriceDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticJobMaterialCatPriceDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'MaterialRates', parentService: logisticJobMaterialCatPriceDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticJobMaterialRateServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'LogisticMaterialRateDto',
			moduleSubModule: 'Logistic.Job',
			validationService: 'logisticJobMaterialRateValidationService'
		});
	}
})(angular);
