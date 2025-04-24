/**
 * Created by baf on 13.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.sundryservice';

	/**
	 * @ngdoc service
	 * @name logisticSundryServicePriceListValidationService
	 * @description provides validation methods for logistic sundryService priceList entities
	 */
	angular.module(moduleName).service('logisticSundryServicePriceListValidationService', LogisticSundryServicePriceListValidationService);

	LogisticSundryServicePriceListValidationService.$inject = ['$http', 'platformValidationServiceFactory', 'platformDataServiceModificationTrackingExtension', 'logisticSundryServiceConstantValues', 'logisticSundryServicePriceListDataService'];

	function LogisticSundryServicePriceListValidationService($http, platformValidationServiceFactory, platformDataServiceModificationTrackingExtension, logisticSundryServiceConstantValues,
		logisticSundryServicePriceListDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticSundryServiceConstantValues.schemes.servicePriceList, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticSundryServiceConstantValues.schemes.servicePriceList),
			periods: [{
				from: 'ValidFrom',
				to: 'ValidTo',
				checkOverlapping: true
			}]
		},
		self,
		logisticSundryServicePriceListDataService);
	}

})(angular);
