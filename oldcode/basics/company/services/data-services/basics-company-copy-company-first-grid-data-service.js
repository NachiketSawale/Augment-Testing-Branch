
(function (angular) {
	'use strict';
	let moduleName = 'basics.company';

	angular.module(moduleName).factory('basicsCompanyCopyCompanyFirstGridDataService', [
		'platformDataServiceFactory',  'globals', 'platformRuntimeDataService', '_',
		function ( platformDataServiceFactory, globals, platformRuntimeDataService, _) {

			let serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'basicsCompanyCopyCompanyFirstGridDataService',
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/company/',
					endRead: 'treefiltered',
					usePostForRead:true
				},
				presenter: {
					tree: {
						parentProp: 'CompanyFk',
						childProp: 'Companies',
						incorporateDataRead: incorporateDataRead
					}
				},
				entitySelection: {},
				modification: {},
				actions: {
					delete: false,
					create: false
				}
			};
			let container = platformDataServiceFactory.createNewComplete(serviceOption);
			let service = container.service;
			let sourceCompanyId = null;
			function incorporateDataRead(readData, data) {
				if (!_.isEmpty(readData.dtos))
				{
					let flatten = [];
					data.flatten(readData.dtos, flatten, container.data.treePresOpt.childProp);

					_.forEach(flatten, function (item) {
						if (item.Id === sourceCompanyId) {
							platformRuntimeDataService.readonly(item, [{field: 'selection', readonly: true}]);
						}
						item.selection = false;
					});
				}
				return data.handleReadSucceeded(readData.dtos, data);
			}

			service.setSourceCompanyId = function setSourceCompanyId(id) {
				sourceCompanyId = id;
			};

			service.getSelectedData = function getSelectedData() {
				let list = service.getList();
				let dataList = [];
				_.forEach(list, function (item) {
					if (item.selection) {
						dataList.push(item);
					}
				});
				return dataList;
			};
			container.data.markItemAsModified = function () {
			};
			service.markItemAsModified = function () {
			};
			return service;
		}
	]);
})(angular);