/**
 * Created by lid on 8/10/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).value('mountingDialogProductListColumns', {
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

	angular.module(moduleName).factory('mountingDialogProductListService', MountingDialogProductListService);
	MountingDialogProductListService.$inject = ['$http', '$log', '$q', '$injector', 'PlatformMessenger',
		'treeviewListDialogListFactoryService',
		'productionplanningMountingContainerInformationService'
	];
	function MountingDialogProductListService($http, $log, $q, $injector, PlatformMessenger,
											  treeviewListDialogListFactoryService,
											  mountingContainerInformationService) {


		var reportGUID = '518268e717e2413a8107c970919eea85';
		var report2productGUID = '5dad005fa09b4e2eaf64da8707ec8fe4';
		var reportService = mountingContainerInformationService.getContainerInfoByGuid(reportGUID).dataServiceName;
		var report2ProductService = mountingContainerInformationService.getContainerInfoByGuid(report2productGUID).dataServiceName;

		var moduleId = '889ba8a32ba94819a714d20ede7eaf95';
		var serviceOptions = {
			flatRootItem: {
				module: angular.module(moduleName),
				serviceName: 'mountingDialogProductListService',
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