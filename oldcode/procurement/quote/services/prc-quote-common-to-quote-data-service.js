/**
 * Created by wui on 6/27/2018.
 */

// eslint-disable-next-line no-redeclare
/* global angular */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.quote';

	// BoqStructureController
	angular.module(moduleName).factory('procurementQuoteBoqItemService', ['procurementQuoteRequisitionDataService','procurementCommonPrcBoqService','prcBoqMainService',
		function(parentService,dataServiceFactory,prcBoqMainService){
			return prcBoqMainService.getService(parentService);
		}]);

	// procurementCommonPrcItemListController
	angular.module(moduleName).factory('procurementQuoteItemDataService', ['procurementQuoteRequisitionDataService','procurementCommonPrcItemDataService',
		function(parentService,dataServiceFactory){
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementQuoteGrpSetDTLDataService
	angular.module(moduleName).factory('procurementQuoteGrpSetDTLDataService',['procurementQuoteRequisitionDataService','controllingStructureGrpSetDTLDataService','procurementCommonPrcItemDataService',
		function (parentService,dataService,itemDataService) {
			var itemService = itemDataService.getService(parentService);
			return dataService.createService(itemService,'procurementQuoteGrpSetDTLDataService');
		}]);

})(angular);