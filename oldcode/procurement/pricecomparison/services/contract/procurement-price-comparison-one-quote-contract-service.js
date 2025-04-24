(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	/* jshint -W072 */
	angular.module(moduleName).factory('procurementPriceComparisonOneQuoteContractService', [
		'platformDataServiceFactory', 'procurementPriceComparisonOneQuoteContractMainService',
		function (platformDataServiceFactory, procurementPriceComparisonOneQuoteContractMainService) {

			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementPriceComparisonOneQuoteContractService',
				entitySelection: {},
				presenter: {
					tree: {
						parentProp: '',
						childProp: 'Children'
					}
				},
				httpRead: {
					useLocalResource: true,
					resourceFunction: getData
				},
				httpUpdate: {},
				httpCreate: {},
				httpDelete: {},

				isInitialSorted: false
			};

			return platformDataServiceFactory.createNewComplete(serviceOption).service;

			function getData() {
				var quoteHeaders = procurementPriceComparisonOneQuoteContractMainService.getQuote();
				var quoteParent = _.find(quoteHeaders, {QtnHeaderFk: null});
				quoteParent.Children = _.filter(quoteHeaders, {QtnHeaderFk: quoteParent.Id});
				return [quoteParent];
			}
		}
	]);
})(angular);