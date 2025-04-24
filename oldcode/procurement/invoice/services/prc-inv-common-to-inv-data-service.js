/**
 * Created by lcn on 5/24/2019.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular */

	var moduleName = 'procurement.invoice';


	// procurementInvGrpSetDTLByOtherDataService
	angular.module(moduleName).factory('procurementInvGrpSetDTLByOtherDataService',['controllingStructureGrpSetDTLDataService','procurementInvoiceOtherDataService',
		function (dataService,parentService) {
			return dataService.createService(parentService,'procurementInvGrpSetDTLByOtherDataService');
		}]);

	// procurementInvGrpSetDTLByContractDataService
	angular.module(moduleName).factory('procurementInvGrpSetDTLByContractDataService',['controllingStructureGrpSetDTLDataService','procurementInvoiceContractDataService',
		function (dataService,parentService) {
			return dataService.createService(parentService,'procurementInvGrpSetDTLByContractDataService');
		}]);

	// procurementInvGrpSetDTLByTransactionDataService
	angular.module(moduleName).factory('procurementInvGrpSetDTLByTransactionDataService',['controllingStructureGrpSetDTLDataService','procurementInvoiceTransactionDataService',
		function (dataService,parentService) {
			return dataService.createService(parentService,'procurementInvGrpSetDTLByTransactionDataService');
		}]);

	// procurementInvGrpSetDTLByRejectionDataService
	angular.module(moduleName).factory('procurementInvGrpSetDTLByRejectionDataService',['controllingStructureGrpSetDTLDataService','procurementInvoiceRejectionDataService',
		function (dataService,parentService) {
			return dataService.createService(parentService,'procurementInvGrpSetDTLByRejectionDataService');
		}]);

	// procurementInvSalesTaxDataService
	angular.module(moduleName).factory('procurementInvSalesTaxDataService',['procurementCommonSalesTaxDataService','procurementInvoiceHeaderDataService',
		function (dataService,parentService) {
			return dataService.createService(parentService,'procurementInvSalesTaxDataService',moduleName);
		}]);

})(angular);



