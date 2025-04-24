/**
 * Created by wed on 09/04/2019.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).factory('basicsCostGroupFilterCatalogDataFactory', [
		'_',
		'globals',
		'$http',
		'$q',
		'platformObjectHelper',
		'PlatformMessenger',
		'basicsCostGroupFilterCacheService',
		'basicsCostGroupFilterCacheTypes',
		function (_,
		          globals,
		          $http,
		          $q,
		          platformObjectHelper,
		          PlatformMessenger,
		          filterCacheService,
		          cacheTypes) {

			function createService(serviceDescriptor, configModuleType, configModuleName, createOptions) {
				if (!filterCacheService.hasService(cacheTypes.COSTGROUP_CATALOG_DATA_SERVICE, serviceDescriptor)) {

					var options = angular.merge({
							getProject: function () {
								return null;
							}
						}, createOptions),
						service = {
							_itemList: [],
							onSelectedChanged: new PlatformMessenger(),
							onLoadBefore: new PlatformMessenger(),
							onLoadEnd: new PlatformMessenger(),
							load: function () {
								this.onLoadBefore.fire();
								if (this._itemList.length) {
									return $q.when(this._itemList).then(function () {
										service.onLoadEnd.fire();
										return service._itemList;
									});
								} else {
									return $http.post(globals.webApiBaseUrl + 'basics/costgroupcat/listbyconfig', {
										configModuleType: configModuleName,
										configModuleName: configModuleName,
										projectId: options.getProject()
									}).then(function (response) {
										var enterpriseCatalogs = platformObjectHelper.getValue(response.data, 'LicCostGroupCats', []),
											projectCatalogs = platformObjectHelper.getValue(response.data, 'PrjCostGroupCats', []);
										service._itemList = enterpriseCatalogs.concat(projectCatalogs);
										service.onLoadEnd.fire();
										return service._itemList;
									});
								}
							},
							refresh: function () {
								var currItemList = _.map(this._itemList);
								this._itemList.length = 0;
								return this.load().then(function (itemList) {
									for (var i = 0; i < itemList.length; i++) {
										var item = itemList[i], currItem = _.find(currItemList, {Id: item.Id});
										if (currItem) {
											angular.extend(currItem, item);
											itemList[i] = currItem;
										}
									}
									return itemList;
								});
							},
							getList: function () {
								return this._itemList;
							},
							getEnterpriseList: function () {
								return _.filter(this._itemList, function (item) {
									return item.LineItemContextFk !== null;
								});
							},
							getProjectList: function () {
								return _.filter(this._itemList, function (item) {
									return item.ProjectFk !== null;
								});
							},
							getSelected: function () {
								return this._selectedItem;
							},
							setSelected: function (item) {
								this._selectedItem = item;
								this.onSelectedChanged.fire(this._selectedItem);
							}
						};

					filterCacheService.setService(cacheTypes.COSTGROUP_CATALOG_DATA_SERVICE, serviceDescriptor, service);

				}
				return filterCacheService.getService(cacheTypes.COSTGROUP_CATALOG_DATA_SERVICE, serviceDescriptor);
			}

			return {
				createService: createService
			};

		}]);

})(angular);