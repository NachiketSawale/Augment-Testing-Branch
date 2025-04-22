/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'sales.billing';
	angular.module(moduleName).factory('salesBillingQtoDetailValidationService', ['salesBillingQtoDetailService', 'qtoDetailValidationServiceFactory', 'qtoBoqType',
		function (dataService, qtoDetailValidationServiceFactory, qtoBoqType) {

			var service = {};

			service = qtoDetailValidationServiceFactory.createNewQtoDetailValidationService(dataService, qtoBoqType.BillingBoq);

			return service;
		}
	]);
})(angular);
