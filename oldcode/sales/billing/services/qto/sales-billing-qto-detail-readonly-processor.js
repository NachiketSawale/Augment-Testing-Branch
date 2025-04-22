/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	angular.module('sales.billing').factory('salesBillingQtoDetailReadOnlyProcessor',
		['qtoReadOnlyProcessorFactory', 'qtoBoqType',
			function (qtoReadOnlyProcessorFactory, qtoBoqType) {
				var service = qtoReadOnlyProcessorFactory.createReadOnlyProcessorService(qtoBoqType.BillingBoq);

				return service;
			}]);
})(angular);
