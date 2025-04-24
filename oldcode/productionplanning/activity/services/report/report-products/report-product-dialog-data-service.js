/**
 * Created by lid on 2/5/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.activity';

	angular.module(moduleName).value('activityReportProductDialogListColumns', {
		getStandardConfigForListView: function () {
			return {
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						readonly: true,
						sortable: true,
						editor: null

					},
					{
						id: 'description',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'translation',
						editor: null,
						sortable: true,
						readonly: true
					}
				]
			};
		}
	});

	angular.module(moduleName).factory('activityReportProductDialogListService', ProductDialogListService);
	ProductDialogListService.$inject = ['$http', '$log', '$q', '$injector',
		'PlatformMessenger',
		'treeviewListDialogListFactoryService',
		'productionplanningActivityContainerInformationService'];
	function ProductDialogListService($http, $log, $q, $injector,
									  PlatformMessenger,
									  treeviewListDialogListFactoryService,
									  activityContainerInformationService) {

		var reportGUID = '1435d4d81ed6429bb7cdcfb80ff39f2b';
		var report2productGUID = 'd747e68bb9544804bf5a908b714315ce';
		var reportService = activityContainerInformationService.getContainerInfoByGuid(reportGUID).dataServiceName;
		var report2ProductService = activityContainerInformationService.getContainerInfoByGuid(report2productGUID).dataServiceName;

		var moduleId = 'f71da13c7f924d7e9ef3924120b8864f';
		var serviceOptions = {
			flatRootItem: {
				module: angular.module(moduleName),
				serviceName: 'activityReportProductDialogListService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/common/product/',
					endRead: 'listForMounting'
				},
				actions: {},
				entityRole: {
					root: {
						itemName: 'ProductDto',
						descField: 'DescriptionInfo.Translated'
					}
				}
			}
		};
		serviceOptions.getUrlFilter = function getUrlFilter() {
			return 'activityFk=' + reportService.getSelected().ActivityFk;
		};
		var serviceContainer = treeviewListDialogListFactoryService.getService(moduleId, serviceOptions, undefined, true);

		var service = serviceContainer.service;

		angular.extend(service, {
			refresh: refresh,
			search: search
		});

		function refresh() {
			var defer = $q.defer();
			var index = 0;
			service.setAllItems([]);
			service.loadAllItems().then(function (productList) {
				var addedProducts = report2ProductService.getAddedProduct();
				if (addedProducts !== null) {
					var ids = [];
					_.forEach(productList, function (product) {
						_.forEach(addedProducts, function (added) {
							if (added.Id === product.Id) {
								ids.push(index);
							}
						});
						index++;
					});

					//remove added product
					_.forEach(ids.reverse(), function (id) {
						productList.splice(id, 1);
					});
				}
				service.setAllItems(productList);
				service.setList(productList);
				defer.resolve(productList);
			});
			return defer.promise;
		}

		function search(searchString) {
			var options = service.getOptions();
			options.searchString = searchString && searchString.length > 0 ? searchString.toLowerCase() : '';
			refresh().then(function (listE) {
				var listSearchByCodeDescriptionE = service.getItemsByCodeDescription(options.searchString, listE);
				service.setList(listSearchByCodeDescriptionE);
			});
		}

		return service;
	}
})(angular);