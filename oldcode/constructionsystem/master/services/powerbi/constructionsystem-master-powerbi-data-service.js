/**
 * Created by hae on 2018-07-02.
 */
(function (angular) {
	'use strict';

	/* globals globals,_ */
	/**
	 * @ngdoc service
	 * @name MtwoControlTowerConfigurationItemService
	 * @function
	 *
	 * @destription
	 * mtwoControlTowersMainService is the data service for all ControlTowers related functionality
	 *
	 */

	var moduleName = 'constructionsystem.master';
	var ControlTowerModul = angular.module(moduleName);

	ControlTowerModul.factory('constructionsystemMasterPowerBiDataService', ConstructionsystemMasterPowerBiDataService);
	ConstructionsystemMasterPowerBiDataService.$inject = ['mtwoControlTowerConfigurationMainService',
		'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'ServiceDataProcessArraysExtension', 'mtwoControlTowerConfigurationImageProcessor',
		'constructionSystemMasterHeaderService'];

	function ConstructionsystemMasterPowerBiDataService(
		mtwoControlTowerConfigurationMainService,
		platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension,
		ServiceDataProcessArraysExtension,
		mtwoControlTowerConfigurationImageProcessor,
		constructionSystemMasterHeaderService
	) {
		var itemServiceOption = {
			hierarchicalNodeItem: {
				module: ControlTowerModul,
				httpRead: {route: globals.webApiBaseUrl + 'mtwo/controltower/powerbiitem/',
					endRead: 'getlistbypermissions',
					usePostForRead: true,
					initReadData: function (readData/* , data */) {
						angular.extend(readData, getSearchFilter());
					}
				},
				entityRole: {
					node:
						{
							itemName: 'MtoPowerbiitem',
							parentService: mtwoControlTowerConfigurationMainService
						}
				},
				dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems']), mtwoControlTowerConfigurationImageProcessor],
				presenter: {
					tree: {
						parentProp: 'groupid', childProp: 'ChildItems',
						incorporateDataRead: function (readData, data) {
							readData.forEach(doItemCheck);
							/* readData = moduleFilter(readData); */
							return data.handleReadSucceeded(readData, data);
						}
					}
				}
			}
		};
		var serviceContainer = platformDataServiceFactory.createNewComplete(itemServiceOption);
		// serviceContainer.service.callRefresh = serviceContainer.service.refresh || serviceContainer.data.onRefreshRequested;
		mtwoControlTowerConfigurationMainService.onUpdateItems.register(function () {
			serviceContainer.service.load();
		});
		constructionSystemMasterHeaderService.registerListLoaded(function () {
			serviceContainer.service.load();
		});
		var service = serviceContainer.service;
		var serviceData = serviceContainer.data;
		// check box logic
		var allChildItems = [];
		service.isLiveChanged = function (changeItem, checkStatus) {
			changeItem.IsLive = checkStatus;
			allChildItems = [];
			getAllChildItems(changeItem.ChildItems);
			_.forEach(allChildItems, function (item) {
				item.IsLive = checkStatus;
				service.markItemAsModified(item);
			});
			serviceData.itemTree.forEach(doItemCheck);
			service.gridRefresh();
			return true;
		};
		var getAllChildItems = function (item) {
			if (item) {
				allChildItems = allChildItems.concat(item);
				_.forEach(item, function (item) {
					if (item.ChildItems !== null) {
						getAllChildItems(item.ChildItems);
					}
				});
			}
		};
		function getSearchFilter(){
			return {
				CallingModule: 'constructionsystem.master'
			};
		}
		// eslint-disable-next-line no-unused-vars
		function moduleFilter(items){
			var allowedReports = [];
			angular.forEach(items,function (item) {
				if(item.Permissions ){
					var permArr = item.Permissions.split(',');
					angular.forEach(permArr,function (perm) {
						if(perm === 'Estimate'){
							allowedReports.push(item);
						}
					});
				}
			});

			return allowedReports;
		}
		function doItemCheck(item) {
			if (item.ChildItems && item.ChildItems.length) {
				var checkedItems = [], unCheckedItems = [];
				item.ChildItems.forEach(function (item) {
					var isLive = doItemCheck(item);

					if (isLive === true) {
						checkedItems.push(item);
					}
					else if (isLive !== 'unknown') {
						unCheckedItems.push(item);
					}
				});

				if (checkedItems.length === item.ChildItems.length) {
					item.IsLive = true;
				}
				else if (unCheckedItems.length === item.ChildItems.length) {
					if (item.IsLive === true) {
						item.IsLive = 'unknown';
					}
					else {
						item.IsLive = false;
					}
				}
				else
				{
					item.IsLive = 'unknown';
				}
			}
			return item.IsLive;
		}

		return serviceContainer.service;
	}
})(angular);
