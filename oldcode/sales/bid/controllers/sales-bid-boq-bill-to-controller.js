(function () {

	'use strict';
	const moduleName = 'sales.bid';

	angular.module(moduleName).controller('salesBidBoqBillToController',
		['$scope', '_', 'platformGridControllerService','salesBidBoqStructureService', 'boqMainBillToUIServiceFactory', 'salesBidBoqBillToDataService', 'platformPermissionService', 'permissions',
			function salesBoqMainNodeControllerFunction($scope, _, platformGridControllerService, salesBidBoqStructureService, boqMainBillToUIServiceFactory, salesBidBoqBillToDataService, platformPermissionService, permissions) {
				var dataService = salesBidBoqBillToDataService.getService(salesBidBoqStructureService);
				var uiService = boqMainBillToUIServiceFactory.createUIService({currentBoqMainBillToDataService: dataService});
				platformGridControllerService.initListController($scope, uiService, dataService, null, {columns: []});
				platformPermissionService.restrict('80a9828f31e9450c8ef0eb8ba9fefe0a', permissions.read);
			}
		]);

	angular.module(moduleName).factory('salesBidBoqBillToDataService', ['globals', 'platformDataServiceFactory', '$injector',
		function(globals, platformDataServiceFactory, $injector) {
			return {
				getService: function(parentService) {
					let serviceContainer;
					const serviceOptions = {
						flatLeafItem: {
							serviceName: 'salesBidBoqBillToDataService',
							entityRole: { leaf: { itemName:'BillTos', parentService:parentService } },
							httpRead: {
								route: globals.webApiBaseUrl+'boq/main/billto/', endRead: 'getprojectboqbilltoitems',
								initReadData: function(readData) {
									const currentBoqItem = parentService.getSelected();
									readData.filter = '?currentBoqItemId=' + currentBoqItem.Id + '&selectedProjectId=' + parentService.getSelectedProjectId();
								}
							},
							presenter: {
								list: {
									incorporateDataRead: function (readData, data) {
										var boqMainBillToDataServiceFactory = $injector.get('boqMainBillToDataServiceFactory');
										var boqMainBillToDataService = boqMainBillToDataServiceFactory.getService(parentService, moduleName);
										readData = boqMainBillToDataService.calculateTotalQuantity(readData);
										return data.handleReadSucceeded(readData, data);
									}
								}
							}
						}
					};
					serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);

					return serviceContainer.service;
				}
			};
		}
	]);
})();


