
(function (angular) {
	'use strict';
	let moduleName = 'basics.company';

	angular.module(moduleName).factory('basicsCompanyCopyCompanySecondGridDataService', [
		'platformDataServiceFactory',
		'globals',
		'_',
		function ( platformDataServiceFactory,
			globals,
			_) {

			let serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'basicsCompanyCopyCompanySecondGridDataService',
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/rubriccategoryindex/',
					endRead: 'tree',
				},
				presenter: {
					tree: {
						parentProp: 'ParentId',
						childProp: 'Children',
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
			function incorporateDataRead(readData, data) {
				if (!_.isEmpty(readData))
				{
					let flatten = [];
					data.flatten(readData, flatten, container.data.treePresOpt.childProp);

					_.forEach(flatten, function (item) {
						item.selection = false;
					});
				}
				return data.handleReadSucceeded(readData, data);
			}
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