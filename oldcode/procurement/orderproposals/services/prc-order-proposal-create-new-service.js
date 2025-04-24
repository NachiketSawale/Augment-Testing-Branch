(function (angular) {
	/* global globals, _ */
	'use strict';

	var moduleName = 'procurement.orderproposals';

	angular.module(moduleName).factory('procurementOrderProposalCreateNewService',
		['$injector', 'platformDataServiceFactory', 'procurementOrderProposalsDataService','platformRuntimeDataService', 'cloudDesktopSidebarService',
			function procurementOrderProposalsDataService($injector, dataServiceFactory, procurementOrderProposalsDataService, platformRuntimeDataService, cloudDesktopSidebarService) {
				var service;
				var sidebarSearchOptions = {
					moduleName: moduleName,  // required for filter initialization
					pattern: '',
					pageSize: 100,
					useCurrentClient: null,
					includeNonActiveItems: null,
					showOptions: false,
					showProjectContext: false,
					pinningOptions: {
						isActive: true, showPinningContext: [{token: 'project.main', show: true}],
						setContextCallback: cloudDesktopSidebarService.setCurrentProjectToPinnningContext
					},
					withExecutionHints: false
				};

				var onReadSucceeded = function onReadSucceeded(readData, data) {
					var orderProposalList = procurementOrderProposalsDataService.getList();
					var stock2matIds = _.map(orderProposalList, 'Stock2matId');
					if (readData) {
						readData = _.filter(readData, function (e) {
							return stock2matIds.indexOf(e.Stock2matId) === -1;
						});
					}
					var itemList = data.handleReadSucceeded(readData, data, true);
					service.setRowReadonly(readData);
					return itemList;
				};

				var serviceOptions = {
					module: angular.module(moduleName),
					serviceName: 'procurementOrderProposalCreateNewService',
					httpRead: {
						route: globals.webApiBaseUrl + 'procurement/stock/stocktotal/', endRead: 'createList',
						usePostForRead: true
					},
					presenter: {
						list: {
							incorporateDataRead: onReadSucceeded,
							initCreationData: function initCreationData(creationData) {
								if (creationData.ProjectContextId === null || angular.isUndefined(creationData.ProjectContextId)) {
									creationData.ProjectContextId = 0;
								}
							}
						}
					},
					sidebarSearch: {options: sidebarSearchOptions},
					entitySelection: {},
					modification: {},
					actions: { delete: false, create: false, bulk: false }
				};
				var serviceContainer = dataServiceFactory.createNewComplete(serviceOptions);
				service = serviceContainer.service;

				service.setRowReadonly = function(items){
					if(_.isArray(items)){
						_.forEach(items, function(item){
							platformRuntimeDataService.readonly(item, true);
						});
					}
				};
				return service;
			}]);
})(angular);