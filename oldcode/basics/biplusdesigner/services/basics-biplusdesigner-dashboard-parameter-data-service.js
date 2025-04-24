
(function (angular) {
	'use strict';
	var moduleName = 'basics.biplusdesigner';
	var module = angular.module(moduleName);

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).factory('basicsBiPlusDesignerDashboardParameterDataService',
		['$q', 'procurementCommonReadDataInterceptor', 'platformDataServiceFactory', 'basicsBiPlusDesignerService',
			'basicsLookupdataLookupDescriptorService',
			function ($q, procurementCommonReadDataInterceptor, dataServiceFactory, parentService,
			          basicsLookupdataLookupDescriptorService) {
				var serviceContainer;
				var service;
				var serviceOption = {
					flatLeafItem: {
						module: module,
						serviceName: 'basicsBiPlusDesignerDashboardParameterDataService',
						httpCRUD: {
							route: globals.webApiBaseUrl + 'basics/biplusdesigner/dashboard/parameter/',
							endRead: 'listByParent',
							usePostForRead: true,
							initReadData: function initReadData(readData) {
								var dashboard = parentService.getSelected();
								readData.PKey1 = (dashboard ? dashboard.Id : -1);
							}
						},
						presenter: {
							list: {
								initCreationData: function (creationData) {
									console.log('init creation data');
									var parentItem = (creationData.dashboard) ? creationData.dashboard : parentService.getSelected();
									creationData.PKey1 = (parentItem ? parentItem.Id : -1);
								}
							}
						},
						entityRole: {
							leaf: {
								itemName: 'DashboardParameter',
								parentService: parentService
							}
						},
						dataProcessor: [],
						actions: {delete: true, create: 'flat'},
						handleCreateSucceeded: function (item) {
							item.IsVisible = true;
						}
					},
					entitySelection: {}
				};


				serviceContainer = dataServiceFactory.createNewComplete(serviceOption);
				service = serviceContainer.service;

				

				service.registerEntityCreated(onEntityCreated);

				service.createNewParameter = function (dashboardId) {
					return service.createItem({dashboardId:dashboardId});
				};
				
				function onEntityCreated(e,newEntity){
					newEntity.IsVisible = true;
				}

				return service;
			}]);
})(angular);