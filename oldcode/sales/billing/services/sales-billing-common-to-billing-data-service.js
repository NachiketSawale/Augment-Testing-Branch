/**
 * $Id$
 * Copyright (c) RIB Software SE
 */
(function (angular) {
	'use strict';

	var moduleName = 'sales.billing';


	// salesBillingGrpSetDTLService
	angular.module(moduleName).factory('salesBillingGrpSetDTLService',['controllingStructureGrpSetDTLDataService','salesBillingTransactionService',
		function (dataService,parentService) {
			return dataService.createService(parentService,'salesBillingGrpSetDTLService');
		}]);

})(angular);



