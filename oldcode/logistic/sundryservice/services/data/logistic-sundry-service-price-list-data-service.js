/**
 * Created by baf on 13.03.2018
 */

(function (angular) {
	/* global globals */
	'use strict';
	var myModule = angular.module('logistic.sundryservice');

	/**
	 * @ngdoc service
	 * @name logisticSundryServicePriceListDataService
	 * @description pprovides methods to access, create and update logistic sundryService priceList entities
	 */
	myModule.service('logisticSundryServicePriceListDataService', LogisticSundryServicePriceListDataService);

	LogisticSundryServicePriceListDataService.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'logisticSundryServiceConstantValues', 'logisticSundryServiceDataService'];

	function LogisticSundryServicePriceListDataService(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, logisticSundryServiceConstantValues, logisticSundryServiceDataService) {
		var self = this;
		var logisticSundryServicePriceListServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'logisticSundryServicePriceListDataService',
				entityNameTranslationID: 'logistic.sundryservice.priceListEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'logistic/sundryService/priceList/',
					endRead: 'listByParent',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = logisticSundryServiceDataService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					logisticSundryServiceConstantValues.schemes.servicePriceList)],
				actions: {delete: true, create: 'flat'},
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = logisticSundryServiceDataService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'PriceLists', parentService: logisticSundryServiceDataService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(logisticSundryServicePriceListServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'logisticSundryServicePriceListValidationService'
		}, logisticSundryServiceConstantValues.schemes.servicePriceList));
	}
})(angular);
