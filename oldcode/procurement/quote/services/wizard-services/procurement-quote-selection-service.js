(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	var moduleName = 'procurement.quote';
	angular.module(moduleName).factory('procurementQuoteSelectionService',
		['platformDataServiceFactory', 'PlatformMessenger', function (platformDataServiceFactory, PlatformMessenger){

			var serviceContainer = platformDataServiceFactory.createNewComplete({
				module: angular.module(moduleName),
				serviceName: 'procurementQuoteSelectionService',
				// entityRole: { root: { itemName: serviceName} },
				presenter: {list:{}},
				entitySelection: {},
				modification:{simple:{}}
			});

			let rawData = [];
			Object.defineProperty(serviceContainer.service, 'rawData', {
				get: function () {
					return rawData;
				},
				set: function (data) {
					rawData = data;
				}
			});

			serviceContainer.service.rawDataLoaded = new PlatformMessenger();

			serviceContainer.service.setList = serviceContainer.data.setList = function setList(items){
				var data = serviceContainer.data;
				// clear current data
				data.doClearModifications(null, data);
				data.selectedItem = null;
				data.itemList.length = 0;
				_.forEach(items, function(item) {
					item.UpdateWithQuoteData = false;
					item.PaymentFromSupplierPerBid = false;
					item.UpdateWithReqData = false;
					data.itemList.push(item);
				});

				serviceContainer.data.listLoaded.fire();
			};

			serviceContainer.service.getSelectedBidders = function getSelectedBidders() {
				var allBidders = serviceContainer.service.getList();
				return _.filter(allBidders, {Selected: true});
			};

			serviceContainer.service.markItemAsModified = function () {

			};

			return serviceContainer.service;
		}]);

})(angular);