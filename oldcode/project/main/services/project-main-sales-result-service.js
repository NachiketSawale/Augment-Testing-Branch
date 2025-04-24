(function (angular) {
	'use strict';
	var moduleName = 'project.main';
	var projectMainModule = angular.module(moduleName);

	projectMainModule.factory('projectMainSalesResultService', ['$http', '$q', '$log', 'projectMainService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',

		function ($http, $q, $log, projectMainService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension) {

			var options = {
				flatLeafItem: {
					module: projectMainModule,
					serviceName: 'projectMainSalesResultService',
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'OrdHeaderDto',
						moduleSubModule: 'Sales.Contract'
					}), {
						processItem: function (item) {
							item.Id = item.Code;
						}
					}],
					httpRead: {route: globals.webApiBaseUrl + 'sales/contract/', endRead: 'GetSalesResultByProject'},
					presenter: {
						list: {}
					},
					entityRole: {
						leaf: {
							itemName: 'SaleResults',
							parentService: projectMainService,
							parentFilter: 'projectId'
						}
					}
				}
			};

			var container = platformDataServiceFactory.createNewComplete(options);
			container.data.doesRequireLoadAlways = true;

			container.service.disablePrev = function () {
				var list = container.service.getList();
				return list.indexOf(container.service.getSelected()) === 0;
			};

			container.service.disableNext = function () {
				var list = container.service.getList();
				return list.indexOf(container.service.getSelected()) === (list.length - 1);
			};

			return container.service;

		}]);
})(angular);
