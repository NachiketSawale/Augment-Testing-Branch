/**
 * Created by alm on 9/29/2021.
 */

(function () {
	'use strict';
	var moduleName='controlling.revrecognition';

	angular.module(moduleName).factory('controllingRevenueRecognitionAccrualService', ['globals', '_','$http','$injector','moment','PlatformMessenger','platformGridAPI','platformDataServiceFactory','controllingRevenueRecognitionItemReadonlyProcessor','ServiceDataProcessDatesExtension','controllingRevenueRecognitionHeaderDataService',
		function (globals, _,$http,$injector,moment,PlatformMessenger,platformGridAPI,platformDataServiceFactory,prrItemReadonlyProcessor,ServiceDataProcessDatesExtension,mainDataService) {

			var serviceOptions = {
				hierarchicalNodeItem: {
					module: angular.module(moduleName),
					serviceName: 'controllingRevenueRecognitionItemService',
					httpRead: {
						route: globals.webApiBaseUrl + 'controlling/RevenueRecognition/accrual/',
						endRead: 'list'
					},
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead
						}
					},
					dataProcessor: [
						new ServiceDataProcessDatesExtension(['PostingDate','VoucherDate'])
					],
					entityRole: {
						node: {
							itemName: 'CompanyTransaction',
							parentService: mainDataService
						}
					},
					actions: {
						delete: false,
						create: false
					}
				}
			};

			var container = platformDataServiceFactory.createNewComplete(serviceOptions);
			var service = container.service;

			function incorporateDataRead(readItems, data) {
				var list = readItems.Main;
				var transHeaders = readItems.TransactionHeader;
				var prr2TransactionHeaders = readItems.Prr2TransactionHeader;
				_.forEach(list, function(item){
					var found = _.find(transHeaders, { Id: item.CompanyTransheaderFk });
					if (found) {
						item.CompanyTransHeader = found.Description;
					}
					var prr2TransactionHeader = _.find(prr2TransactionHeaders, { BasCompanyTransheaderFk: item.CompanyTransheaderFk });
					if(prr2TransactionHeader) {
						item.TransactionSetId = prr2TransactionHeader.TransactionSetId;
					}
					else{
						item.TransactionSetId =1;
					}
				});
				return data.handleReadSucceeded(list, data);
			}

			return service;
		}]);
})();
