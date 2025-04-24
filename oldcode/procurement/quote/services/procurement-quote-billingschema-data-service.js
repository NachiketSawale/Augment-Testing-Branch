/**
 * Created by wed on 6/1/2018.
 */

// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {
	'use strict';

	angular.module('procurement.quote').factory('procurementQuoteBillingSchemaDataService', ['basicsBillingSchemaServiceFactory', 'procurementQuoteHeaderDataService', function (basicsBillingSchemaServiceFactory, parentService) {

		var qualifier = 'procurement.quote.billingschmema';
		var service = basicsBillingSchemaServiceFactory.getService(qualifier, parentService, {
			onUpdateSuccessNotify: parentService.onUpdateSucceeded
		});

		service.getRubricCategory = function (item) {
			var selectItem = item || parentService.getSelected();
			return selectItem.RubricCategoryFk;
		};

		return service;
	}]);

})(angular);
