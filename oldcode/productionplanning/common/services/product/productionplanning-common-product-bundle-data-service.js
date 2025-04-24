/**
 * Created by waz on 7/26/2017.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name transportplanningCommonProductIBundleDataService
	 * @function
	 *
	 * @description
	 * transportplanningBundleProductDataService is the data service for all entities related functionality.
	 */
	var moduleName = 'productionplanning.common';
	var masterModule = angular.module(moduleName);

	masterModule.factory('productionplanningCommonProductBundleDataService', ProductionplanningCommonProductBundleDataService);

	ProductionplanningCommonProductBundleDataService.$inject = [
		'transportplanningBundleMainService',
		'productionplanningCommonProductDataServiceFactory',
		'basicsCommonContainerDialogService',
		'basicsCommonBaseDataServiceReferenceActionExtension'];
	function ProductionplanningCommonProductBundleDataService(parentService,
	                                                          dataFactory,
	                                                          basicsCommonContainerDialogService,
	                                                          referenceActionExtension) {
		var serviceContainer;
		var option = {
			flatNodeItem: {
				serviceName: 'productionplanningCommonProductBundleDataService',
				httpCRUD : {
					route: globals.webApiBaseUrl + 'productionplanning/common/product/',
					endRead: 'customlistbyforeignkey',
					initReadData: function initReadData(readData) {
						let mainItemId = parentService.getSelected().Id || -1;
						readData.filter = `?foreignKey=TrsProductBundleFk&mainItemId=${mainItemId}`;
					}
				},
				entitySelection: {supportsMultiSelection: true},
				entityRole: {
					node: {
						itemName: 'Product',
						parentService: parentService,
						parentFilter: 'bundleFk'
					}
				},
				actions: {
				}
			},
			isNotRoot: true
		};

		function isModifyable() {
			var selectedParentItems = parentService.getSelectedEntities();
			return parentService.isBundlesModifyable(selectedParentItems);
		}

		serviceContainer = dataFactory.createService(option);
		referenceActionExtension.addReferenceActions(serviceContainer, {
			createReference: true,
			deleteReference: true,
			referenceForeignKeyProperty: 'TrsProductBundleFk',
			canCreateReference: function () {
				return isModifyable() && parentService.getSelected() && parentService.getSelected().ProjectFk;
			},
			canDeleteReference: isModifyable
		});
		var service = serviceContainer.service;

		service.showReferencesSelectionDialog = function () {
			var config = {
				bodyTemplateUrl: globals.appBaseUrl + 'basics.common/templates/container-dialog/single-grid-container.html',
				handler: 'basicsCommonContainerDialogSingleGridContainerHandler',
				mainDataService: 'ppsCommonBundleDialogProductDataService',
				uiConfig: {
					dialogTitle: moduleName + '.product.listTitle',
					selectEntityText: 'productionplanning.common.product.entity'
				},
				custom: {
					container: {
						title: moduleName + '.product.listTitle',
						dataService: 'ppsCommonBundleDialogProductDataService',
						uiService: 'ppsCommonBundleDialogProductUiService',
						gridId: '79b0cf159edd4b8993cf557ecbeb9689'
					},
					currentDataService: 'productionplanningCommonProductBundleDataService',
					foreignKey: 'TrsProductBundleFk',
					onOkStart: function (selectedItems) {
						var bundleProductIds = toDict(selectedItems);
						bundleProductIds = extendDict(bundleProductIds);
						parentService.updateProductInfo(bundleProductIds);
					}
				}
			};
			basicsCommonContainerDialogService.showContainerDialog(config);
		};

		service.registerReferenceDeleted(function (e, deletedItems) {
			/*
			var bundleProductIds = toDict(deletedItems);
			var targetKey = parentService.getSelected().Id;
			bundleProductIds[targetKey] = _.filter(parentService.getSelected().ProductCollectionInfo.ProductIds, function (id) {
				return !_.includes(bundleProductIds[targetKey], id);
			});

			parentService.updateProductInfo(bundleProductIds);
			*/

			// 1. get ids of deleted items
			var deletedIds = _.map(deletedItems, 'Id');
			// 2. remove deleted ids from source productIds of bundle
			var newProductIds = _.filter(parentService.getSelected().ProductCollectionInfo.ProductIds,function(id){
				return !_.includes(deletedIds, id);
			});
			// 3. update ProductInfo of bundle according to the new productIds
			var targetKey = parentService.getSelected().Id;
			var obj = {};
			obj[targetKey] = newProductIds;
			parentService.updateProductInfo(obj);

		});

		function toDict(list) {
			var dict = {};
			_.forEach(list, function (item) {
				if (!dict[item.TrsProductBundleFk]) {
					dict[item.TrsProductBundleFk] = [];
				}
				if (!_.includes(dict[item.TrsProductBundleFk], item.Id)) {
					dict[item.TrsProductBundleFk].push(item.Id);
				}
			});
			return dict;
		}

		function extendDict(list) {
			var targetKey = parentService.getSelected().Id;
			var result = {};
			if (!parentService.getSelected().ProductCollectionInfo) {
				parentService.getSelected().ProductCollectionInfo = {};
			}
			result[targetKey] = parentService.getSelected().ProductCollectionInfo.ProductIds ?
				parentService.getSelected().ProductCollectionInfo.ProductIds :
				[];
			_.forEach(list, function (productIds, key) {
				if (Number(key) !== targetKey && key !== 'null') {
					var changeItem = _.find(parentService.getList(), function (item) {
						return item.Id === Number(key);
					});

					if (!changeItem) {
						return;
					}

					result[Number(key)] = _.filter(changeItem.ProductCollectionInfo.ProductIds, function (id) {
						return !_.includes(productIds, id);
					});
				}
				result[targetKey] = _.uniq(_.concat(result[targetKey], productIds));
			});
			return result;
		}


		return service;
	}
})(angular);