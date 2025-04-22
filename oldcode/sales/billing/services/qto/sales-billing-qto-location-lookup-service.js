/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';

	var moduleName = 'sales.billing';

	angular.module(moduleName).factory('salesBillingQtoLocationLookupService', ['qtoProjectLocationLookupDataServiceFactory', 'qtoBoqType',

		function (qtoProjectLocationLookupDataServiceFactory, qtoBoqType) {

			var service = qtoProjectLocationLookupDataServiceFactory.qtoProjectLocationLookupDataServiceFactory(qtoBoqType.BillingBoq);

			return service;

		}]);
})(angular);
