/**
 * Created by leo on 12.03.2018
 */

(function (angular) {
	'use strict';
	var myModule = angular.module('logistic.job');

	/**
	 * @ngdoc service
	 * @name logisticJobSundryServicePriceDataService
	 * @description pprovides methods to access, create and update logistic job  sundry service Price entities
	 */
	myModule.service('logisticJobSundryServicePriceDataService', LogisticJobSundryServicePriceDataService);

	LogisticJobSundryServicePriceDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'logisticJobDataService', 'basicsCommonMandatoryProcessor'];

	function LogisticJobSundryServicePriceDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	                                                  logisticJobDataService, mandatoryProcessor) {
		var self = this;
		var logisticJobSundryServicePriceServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticJobSundryServicePriceDataService',
				entityNameTranslationID: 'logistic.job.sundryServicePriceListTitle',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/job/sundryserviceprice/',
					endRead: 'listbyparent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticJobDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: true, create: 'flat'},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
					typeName: 'LogisticSundryServicePriceDto',
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
					leaf: {itemName: 'SundryServicePrices', parentService: logisticJobDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticJobSundryServicePriceServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = mandatoryProcessor.create({
			typeName: 'LogisticSundryServicePriceDto',
			moduleSubModule: 'Logistic.Job',
			validationService: 'logisticJobSundryServicePriceValidationService',
            mustValidateFields: true
		});
	}
})(angular);
