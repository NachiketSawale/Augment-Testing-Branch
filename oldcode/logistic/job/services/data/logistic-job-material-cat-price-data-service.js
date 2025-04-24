/**
 * Created by baf on 08.02.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.job');

	/**
	 * @ngdoc service
	 * @name logisticJobMaterialCatPriceDataService
	 * @description pprovides methods to access, create and update logistic job MaterialCatPrice entities
	 */
	myModule.service('logisticJobMaterialCatPriceDataService', LogisticJobMaterialCatPriceDataService);

	LogisticJobMaterialCatPriceDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'logisticJobDataService', 'basicsCommonMandatoryProcessor'];

	function LogisticJobMaterialCatPriceDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	                                                logisticJobDataService, mandatoryProcessor) {
		var self = this;
		var logisticJobMaterialCatPriceServiceOption = {
			flatNodeItem: {
				module: myModule,
				serviceName: 'logisticJobMaterialCatPriceDataService',
				entityNameTranslationID: 'logistic.job.materialCatPriceListTitle',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/job/materialcatalogprice/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticJobDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'LogisticMaterialCatalogPriceDto',
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
					node: {itemName: 'MaterialCatPrices', parentService: logisticJobDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticJobMaterialCatPriceServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
			mustValidateFields: true,
			typeName: 'LogisticMaterialCatalogPriceDto',
			moduleSubModule: 'Logistic.Job',
			validationService: 'logisticJobMaterialCatPriceValidationService'
		});
	}
})(angular);
