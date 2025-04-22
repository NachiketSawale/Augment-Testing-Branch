/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var modName = 'sales.billing';

	angular.module(modName).factory('salesBillingQtoListUIStandardService', ['qtoMainDetailLayoutServiceFactory', 'qtoBoqType',

		function (qtoMainDetailLayoutServiceFactory, qtoBoqType) {

			var service = qtoMainDetailLayoutServiceFactory.createQtoDetailLayoutService(qtoBoqType.BillingBoq);

			return service;
		}
	]);
})(angular);



