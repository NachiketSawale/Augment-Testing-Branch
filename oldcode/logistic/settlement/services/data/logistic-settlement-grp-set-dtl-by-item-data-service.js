/**
 * Created by nitsche on 5/06/2020.
 */
(function (angular) {
	'use strict';

	var moduleName = 'logistic.settlement';


	//logisticSettlementGrpSetDtlByItemDataService
	angular.module(moduleName).factory('logisticSettlementGrpSetDtlByItemDataService',['controllingStructureGrpSetDTLDataService','logisticSettlementItemDataService',
		function (dataService,parentService) {
			return dataService.createService(parentService,'logisticSettlementGrpSetDtlByItemDataService');
		}]);
})(angular);



