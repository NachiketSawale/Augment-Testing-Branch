/**
 * Created by nitsche on 5/06/2020.
 */
(function (angular) {
	'use strict';

	var moduleName = 'logistic.settlement';


	//logisticSettlementGrpSetDtlByTransactionDataService
	angular.module(moduleName).factory('logisticSettlementGrpSetDtlByTransactionDataService',['controllingStructureGrpSetDTLDataService','logisticSettlementTransactionDataService',
		function (dataService,parentService) {
			return dataService.createService(parentService,'logisticSettlementGrpSetDtlByTransactionDataService',true);
		}]);
})(angular);
