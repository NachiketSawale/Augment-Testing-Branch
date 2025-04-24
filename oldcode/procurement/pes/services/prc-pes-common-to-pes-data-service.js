/**
 * Created by wui on 6/27/2018.
 */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	var moduleName = 'procurement.pes';

	// BoqStructureController
	angular.module(moduleName).factory('procurementPesBoqItemService', ['procurementPesBoqService','procurementCommonPrcBoqService','prcBoqMainService',
		function(parentService,dataServiceFactory,prcBoqMainService){
			return prcBoqMainService.getService(parentService);
		}]);

	// procurementPesGrpSetDTLDataService
	angular.module(moduleName).factory('procurementPesGrpSetDTLDataService',['controllingStructureGrpSetDTLDataService','procurementPesItemService',
		function (dataService,parentService) {
			return dataService.createService(parentService,'procurementPesGrpSetDTLDataService');
		}]);
})(angular);