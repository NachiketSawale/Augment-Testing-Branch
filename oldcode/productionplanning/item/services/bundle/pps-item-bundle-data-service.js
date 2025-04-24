/**
 * Created by zwz on 8/7/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.item';
	var module = angular.module(moduleName);

	module.factory('productionplanningItemBundleDataService', BundleDataService);

	BundleDataService.$inject = ['$injector', '$http', '$q', 'moment',
		'transportplanningBundleDataServiceContainerBuilder',
		'productionplanningItemDataService',
		'platformDataServiceSelectionExtension',
		'platformModuleStateService',
		'platformGridAPI',
		'productionplanningCommonEventMainServiceFactory'];
	function BundleDataService($injector, $http, $q, moment, ServiceBuilder, parentService, platformDataServiceSelectionExtension, platformModuleStateService, platformGridAPI, eventMainServiceFactory) {

		var mainOptionsType = 'flatNodeItem';
		var serviceInfo = {
			module: module,
			serviceName: 'productionplanningItemBundleDataService'
		};
		var validationService;
		var httpResource = {
			endRead: 'listbyppsitem',
			initReadData: function initReadData(readData) {
				readData.filter = '?ppsItemId=' + _.get(parentService.getSelected(), 'Id') + '&moveToRoot=true';
			}
		};
		var entityRole = {
			node: {
				itemName: 'Bundle',
				parentService: parentService,
				parentFilter: 'ppsItemId'
			}
		};
		var actions = {
		};

		var builder = new ServiceBuilder(mainOptionsType);
		var serviceContainer = builder
			.setServiceInfo(serviceInfo)
			.setValidationService(validationService)
			.setHttpResource(httpResource)
			.setEntityRole(entityRole)
			.setActions(actions)
			.build();

		serviceContainer.service.appendItems = function (bundles) {
			if (_.isArray(bundles)) {
				_.each(bundles, function (bundle) {
					if (!_.some(serviceContainer.data.itemList, {Id: bundle.Id})) {
						let maxProductionDate = bundle.ProductCollectionInfo.MaxProductionDate;
						bundle.ProductCollectionInfo.MaxProductionDate = maxProductionDate ? moment.utc(maxProductionDate) : maxProductionDate;

						let minProductionDate = bundle.ProductCollectionInfo.MinProductionDate;
						bundle.ProductCollectionInfo.MinProductionDate = minProductionDate ? moment.utc(minProductionDate) : minProductionDate;

						serviceContainer.data.itemList.push(bundle);
					}
				});
			}
		};

		serviceContainer.service.canMoveToRoot = function () {
			if (_.isNil(parentService.getSelected())) {
				return false;}

			// check if has selected bundles
			var selectedEntities = serviceContainer.service.getSelectedEntities();
			if(_.isNil(selectedEntities) || selectedEntities.length <= 0){
				return false;
			}

			return selectedEntities.every(function (prod) {
				return !!prod.CanAssign;
			});
		};

		serviceContainer.service.moveToRootPromise = undefined;
		serviceContainer.service.moveToRoot = function () {
			if (!serviceContainer.service.canMoveToRoot()) {
				return;
			}

			var defer = $q.defer();

			var ppsItem = parentService.getSelected();
			var selectedBundles = serviceContainer.service.getSelectedEntities().map(function (bundle){
				return _.clone(bundle);
			});

			$http.get(globals.webApiBaseUrl + 'productionplanning/item/getRootItem?itemId=' + ppsItem.PPSItemFk).then(function (response) {
				var target = response.data;
				var bundleIds = _.map(selectedBundles, 'Id');
				$http.post(globals.webApiBaseUrl + `productionplanning/common/product/listbyppsitemandbundles?ppsItemId=${ppsItem.Id}`, bundleIds).then(function (response) {
					var products = response.data.Main;
					var productToSave = [];
					_.each(products, function (product) {
						product.ProductionSetFk = target.ProductionSetId;
						product.ItemFk = target.Id;
						productToSave.push({
							Product: product
						});
					});
					var modState = platformModuleStateService.state(parentService.getModule());
					if (_.isArray(modState.modifications.ProductToSave)) {
						_.remove(modState.modifications.ProductToSave, function (e) {
							return _.some(productToSave, function (prod) {
								return prod.Product.Id === e.Product.Id;
							});
						});
						modState.modifications.ProductToSave = modState.modifications.ProductToSave.concat(productToSave);
					} else {
						modState.modifications.ProductToSave = productToSave;
					}
					if(modState.modifications.ProductToSave.length > 0) {
						serviceContainer.service.markItemAsModified(null, modState.modifications.ProductToSave[0]);
					}

					// updateDynamicFieldsExtension.updateProductionsetQties(ppsItemDataService, target, reassignedFilter.PPSItemId, modState.modifications.ProductToSave);

					var selectedIndex = _.indexOf(serviceContainer.data.itemList, selectedBundles[0]);

					// _.remove(serviceContainer.data.itemList, {'Id': selectedBundle.Id});
					var itemList = _.filter(serviceContainer.data.itemList, function (item) {
						return !_.includes(bundleIds, item.Id);
					});
					serviceContainer.data.itemList = itemList;

					// var productIds = _.map(products, 'Id');
					// $injector.get('productionplanningItemReassignedProductDataService').addItems(target.Id, productIds);

					$injector.get('productionplanningItemReassignedProductDataService').addItems(target.Id, products, ppsItem);

					var productGridId = '92e45c26b45f4637980c0ba38bf8cd31';
					if (platformGridAPI.grids.exist(productGridId)) {
						var productItemDataService = $injector.get('productionplanningCommonProductItemDataService');
						productItemDataService.removeItems(products);
						productItemDataService.gridRefresh();
					}

					// refresh selection status at last
					serviceContainer.data.listLoaded.fire();
					platformDataServiceSelectionExtension.doSelectCloseTo(selectedIndex, serviceContainer.data);
					serviceContainer.service.gridRefresh();

					defer.resolve();
				});
			});

			// update production set event quantity
			var reduceQty = 0.0;
			selectedBundles.forEach(function (bundle) {
				reduceQty -= bundle.ProductCollectionInfo.ProductsAreaSum.Value;
			});
			var eventService = eventMainServiceFactory.getService('', 'productionplanning.common.item.event');
			eventService.updateProductionEventQuantity(undefined, undefined, reduceQty);

			serviceContainer.service.moveToRootPromise = defer.promise;
		};

		return serviceContainer.service;
	}
})(angular);