(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.item';
	var itemModule = angular.module(moduleName);

	itemModule.factory('productionplanningItemReassignedProductDataService', ReassignedProductDataService);

	ReassignedProductDataService.$inject = ['$injector', '$http', '$q', 'productionplanningItemDataService',
		'platformDataServiceFactory', 'platformDataServiceSelectionExtension', 'ServiceDataProcessArraysExtension', 'productionplanningReassignedProductProcessor',
		'platformModuleStateService', 'platformGridAPI', 'productionplanningCommonProductItemClipboardService',
		'productionplanningItemUpdateDynamicFieldsExtension', 'basicsLookupdataLookupDescriptorService',
		'productionplanningItemDataService', 'productionplanningItemBundleDataService',
		'productionplanningCommonProductItemDataService', 'productionplanningCommonProductItemDataService','$rootScope'];

	function ReassignedProductDataService($injector, $http, $q, ppsItemDataService,
										  platformDataServiceFactory, platformDataServiceSelectionExtension, ArraysExtension, reassignedProductProcessor,
										  platformModuleStateService, platformGridAPI, productItemClipboardService,
										  updateDynamicFieldsExtension, LookupDescriptorService,
										  itemDataService, bundleDataService,
										  productItemDataService, productDataService, $rootScope) {

		var reassignedFilter = {
			PPSItemId: null,
			MaterialGroupId: null,
			StatusIds: null
		};

		var serviceOption = {
			hierarchicalLeafItem: {
				module: itemModule,
				serviceName: 'productionplanningItemReassignedProductDataService',
				entityNameTranslationID: 'productionplanning.item.entityReassignedProduct',
				httpRead: {
					route: globals.webApiBaseUrl + 'productionplanning/item/',
					endRead: 'getreassignedproducts',
					usePostForRead: true,
					initReadData: function (readData) {
						readData.PPSItemId = reassignedFilter.PPSItemId;
						readData.MaterialGroupId = reassignedFilter.MaterialGroupId;
						readData.StatusIds = reassignedFilter.StatusIds;
						readData.TargetPPSItem = reassignedFilter.TargetPPSItem;
						// add IgnoredProductIds (by zwz 2021/06/30 for HP-ALM #121339)
						var modState = platformModuleStateService.state(ppsItemDataService.getModule());
						if (!container.service.flagToConditionIfRefresh && _.isArray(modState.modifications.ProductToSave) && modState.modifications.ProductToSave.length >0) {
							readData.IgnoredProductIds = _.map(modState.modifications.ProductToSave,function (p){
								return p.Product.Id;
							});
						}
					}
				},
				dataProcessor: [new ArraysExtension(['Children']), reassignedProductProcessor],
				presenter: {
					tree: {
						parentProp: 'ParentId',
						childProp: 'Children',
						incorporateDataRead: function (readData, data) {
							LookupDescriptorService.attachData(readData);
							return container.data.handleReadSucceeded(readData.Main, data);
						}
					}
				},
				translation: {
					uid: 'productionplanningItemReassignedProductDataService',
					title: 'productionplanning.item.reassignedProductTitle',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
				},
				actions: {
					create: false,
					delete: false
				}
			}
		};

		/* jshint -W003 */
		var container = platformDataServiceFactory.createNewComplete(serviceOption);

		container.service.flagToConditionIfRefresh = false;
		container.service.filter = function (filters) {

			reassignedFilter.PPSItemId = filters[0];
			reassignedFilter.MaterialGroupId = filters[1];
			reassignedFilter.StatusIds = filters[2];
			reassignedFilter.TargetPPSItem = filters[3];
			container.service.read();
		};

		container.service.updateItemsInSameRoot = function updateItemsInSameRoot (newItems) {
			if (_.isArray(newItems)) {
				_.each(container.data.itemList, function (item) {
					let newItem = _.find(newItems, {Id: item.Id});
					let i = _.findIndex(container.data.itemList, {Id: item.Id});
					container.data.itemList[i] = newItem;
				});
			}

			container.service.gridRefresh();
			var undefinedItems = _.filter(container.data.itemList, function (item) {
				return item === undefined;
			});
			if(undefinedItems.length > 0){
				container.service.read();
			}
		};

		container.service.filterWithinSameParent = function (filters) {
			reassignedFilter.PPSItemId = filters[0];
			reassignedFilter.MaterialGroupId = filters[1];
			reassignedFilter.StatusIds = filters[2];
			reassignedFilter.TargetPPSItem = filters[3];
			$rootScope.$emit('before-save-entity-data');
			$http.post(globals.webApiBaseUrl + 'productionplanning/item/getreassignedproducts', reassignedFilter).then(function (response) {
				if(response && response.data){
					LookupDescriptorService.attachData(response.data);
					let allItems = [];
					container.data.flatten(response.data.Main, allItems, container.data.treePresOpt.childProp);
					container.service.updateItemsInSameRoot(allItems);
				}
				$rootScope.$emit('after-save-entity-data');
			});
		};

		container.service.paste = function (source, target, type) {
			var defferred = $q.defer();
			if (type === 'ppsItem' || type === 'ppsItemProduct' || type === 'ppsItemBundle') {
				var productType = 1;
				var bundleType = 2;
				var itemIds = [];
				var productIds = [];
				var resultData = [];
				var isBundle = false;

				_.each(source, function (item) {
					itemIds.push(item.Id);
					if (item.Type === productType) {
						productIds.push(_.replace(item.Id, 'product', ''));
						resultData.push(_.replace(item.Id, 'product', ''));
					} else if (item.Type === bundleType) {
						isBundle = true;
						var products = item.Children;
						_.each(products, function (product) {
							productIds.push(_.replace(product.Id, 'product', ''));
						});
						var bundleId = _.split(item.Id, '_')[0];
						resultData.push(_.replace(bundleId, 'bundle', ''));
					}
				});

				$http.post(globals.webApiBaseUrl + 'productionplanning/common/product/getproductsbyids', productIds).then(function (response) {
					var products = response.data;
					var productToSave = [];
					_.each(products, function (product) {
						// set ProductionSetFk of product when reassigning bundles/products (HP ALM #115488)
						if (type === 'ppsItemProduct' || type === 'ppsItemBundle') {
							product.ProductionSetFk = target.ProductionSetId;
						}
						product.ItemFk = target.Id;
						productToSave.push({
							Product: product
						});
					});
					var modState = platformModuleStateService.state(ppsItemDataService.getModule());
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

					updateDynamicFieldsExtension.updateProductionsetQties(ppsItemDataService, target, reassignedFilter.PPSItemId, modState.modifications.ProductToSave);

					ppsItemDataService.markItemAsModified(target);

					_.remove(container.data.itemTree, function (e) {
						return _.indexOf(itemIds, e.Id) !== -1;
					});
					_.remove(container.data.itemList, function (e) {
						return _.indexOf(itemIds, e.Id) !== -1;
					});
					container.service.gridRefresh();
					defferred.resolve(resultData);

					if (isBundle) {
						var productGridId = '92e45c26b45f4637980c0ba38bf8cd31';
						if (platformGridAPI.grids.exist(productGridId)) {
							productItemClipboardService.appendProducts(productIds);
						}
					}
				});
			}
			return defferred.promise;
		};

		container.service.canMoveToSelected = function () {
			let item = itemDataService.getSelected();

			if (_.isNil(item) || _.isNil(item.PPSItemFk) || item.PPSItemFk !== reassignedFilter.PPSItemId) {
				return false;
			}

			let selectedEntityIds = _.map(container.service.getSelectedEntities(), 'Id');

			if(selectedEntityIds.length <= 0){
				return false;
			}
			return  selectedEntityIds.every(function (prodId) {
				let prod = _.find(container.data.itemTree, {Id: prodId});
				return prod ? !!prod.CanAssign : false;
			});
		};

		container.service.moveToSelected = function () {
			if (!container.service.canMoveToSelected()) {
				return;
			}

			var selectedEntities = container.service.getSelectedEntities();
			var bundleIds = [];
			var productIds = [];
			_.each(selectedEntities, function (entity) {
				if (_.startsWith(entity.Id, 'bundle')) {
					bundleIds.push(_.replace(_.split(entity.Id, '_')[0], 'bundle', ''));
				}

				if (_.startsWith(entity.Id, 'bundle') && !_.isNil(entity.Children) && entity.Children.length > 0) {
					_.each(entity.Children, function (product) {
						productIds.push(_.replace(product.Id, 'product', ''));
					});
				} else if (_.startsWith(entity.Id, 'product')) {
					productIds.push(_.replace(entity.Id, 'product', ''));
				}
			});

			moveToSelectedPU(selectedEntities, bundleIds, productIds);
		};

		function moveToSelectedPU(selectedEntities, bundleIds, productIds){
			$http.post(globals.webApiBaseUrl + 'productionplanning/common/product/getproductsbyids', productIds).then(function (response) {
				if(response && response.data){
					var products = response.data;
					addProductsToPpsItemProductContainer(products);
					addBundlesToPpsItemBundleContainer(bundleIds);

					removeSelectedEntities(selectedEntities);
				}
			});
		}

		function removeSelectedEntities(selectedEntities) {
			var selectedIndex = _.indexOf(container.data.itemList, selectedEntities[0]);

			_.each(selectedEntities, function (selectedItem) {
				_.remove(container.data.itemTree, function (e) {
					return selectedItem.Id === e.Id;
				});
				_.remove(container.data.itemList, function (e) {
					return selectedItem.Id === e.Id;
				});
			});
			// refresh selection status
			container.data.listLoaded.fire();
			platformDataServiceSelectionExtension.doSelectCloseTo(selectedIndex, container.data);
			container.service.gridRefresh();
		}

		function addProductsToPpsItemProductContainer(products){
			setProductToSaveOfModifications(products);

			productDataService.appendItems(products);
			productDataService.gridRefresh();
			productDataService.updateProductionQuantity();
		}

		function setProductToSaveOfModifications(products){
			var ppsItem = itemDataService.getSelected();

			var productToSave = [];
			_.each(products, function (product) {
				product.ProductionSetFk = ppsItem.ProductionSetId;
				product.ItemFk = ppsItem.Id;
				productToSave.push({
					MainItemId: product.Id,
					Product: product
				});
			});
			var modState = platformModuleStateService.state(ppsItemDataService.getModule());
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
				container.service.markItemAsModified(null, modState.modifications.ProductToSave[0]);
			}
		}

		function addBundlesToPpsItemBundleContainer(bundleIds){
			if (bundleIds.length > 0) {
				$http.post(globals.webApiBaseUrl + 'transportplanning/bundle/bundle/listbyids?moveToBundle=true', bundleIds)
					.then(function (response) {
						if (response && response.data) {
							bundleDataService.appendItems(response.data);
							bundleDataService.gridRefresh();
						}
					});
			}
		}
		// container.service.addItems = function (ppsItemId, productIds) {
		container.service.addItems = function (ppsItemId, products, selectedPpsItem) {
			if (reassignedFilter.PPSItemId !== ppsItemId) {
				return;
			}
			var request = {
				ModifiedProducts: products,
				TargetPPSItem: selectedPpsItem
			};
			$http.post(globals.webApiBaseUrl + 'productionplanning/item/listreassignedbyproducts', request).then(function (response) {
				_.each(response.data, function (item) {
					if (!_.some(container.data.itemTree, {Id: item.Id})) {
						reassignedProductProcessor.processItem(item);
						if (!_.isNil(item.Children) && item.Children.length > 0) {
							_.each(item.Children, function (child) {
								reassignedProductProcessor.processItem(child);
							});
						}
						container.data.itemTree.push(item);
					}
				});
				container.service.gridRefresh();
			});
		};

		return container.service;
	}

	angular.module(moduleName).service('productionplanningItemUpdateDynamicFieldsExtension', Extension);

	Extension.$inject = ['$http', 'basicsLookupdataLookupDescriptorService', 'ppsCommonCustomColumnsServiceFactory', 'ppsEntityConstant'];

	function Extension($http, basicsLookupdataLookupDescriptorService, customColumnsServiceFactory, ppsEntityConstant) {
		// load lookup data of 'EventType', in case we need them for filtering eventType slots
		if (_.isNil(basicsLookupdataLookupDescriptorService.getData('EventType'))) {
			basicsLookupdataLookupDescriptorService.loadData('EventType');
		}

		// 6~8 maps column Quantity, ActualQuantity and RemainingQty
		var colSelection2QtyTypes = {
			6: 'Quantity',
			7: 'ActualQuantity',
			8: 'RemainingQuantity'
		};

		function isQuantityColumn(columnSelection) {
			// columnSelection: 6~8 maps column Quantity, ActualQuantity and RemainingQty
			return columnSelection >= 6 && columnSelection <= 8;
		}

		function updateQties(item, qtiesObj, prodSetQtySlots) {
			if (item) {
				_.each(prodSetQtySlots, function (slot) {
					var qtyType = colSelection2QtyTypes[slot.ColumnSelection];
					if (qtiesObj[qtyType]) {
						item[slot.FieldName] = qtiesObj[qtyType];
					}
				});
			}
		}

		function updateProductionsetQties(ppsItemDataService, ppsItem, sourcePpsItemId, productCompelteDtos) {
			var eventTypes = basicsLookupdataLookupDescriptorService.getData('EventType');
			var prodSetEventTypes = _.filter(eventTypes, function (et) {
				return et.PpsEntityFk === ppsEntityConstant.PPSProductionSet;
			});
			var customColumnsService = customColumnsServiceFactory.getService(moduleName);
			var prodSetQtySlots = _.filter(customColumnsService.eventTypeSlots, function (slot) {
				return isQuantityColumn(slot.ColumnSelection) && prodSetEventTypes.some(function(et){
					return et.PpsEntityFk === ppsEntityConstant.PPSProductionSet && et.Id === slot.PpsEventTypeFk;
				});
			});

			if (prodSetQtySlots && prodSetQtySlots.length > 0) {
				var products = [];
				_.each(productCompelteDtos, function (e) {
					if (e && e.Product) {
						products.push(e.Product);
					}
				});

				var sourcePpsItem = null;
				if (sourcePpsItemId) {
					sourcePpsItem = _.find(ppsItemDataService.getList(), { Id: sourcePpsItemId });
				}

				var request = {
					TargetProductionSetId: ppsItem.ProductionSetId,
					SourceProductionSetId: _.isNil(sourcePpsItem) ? null : sourcePpsItem.ProductionSetId,
					Products: products
				};
				$http.post(globals.webApiBaseUrl + 'productionplanning/productionset/productionset/calculateproductionsetqties', request)
					.then(function (result) {
						if (result.data) {
							updateQties(ppsItem, result.data.targetQties, prodSetQtySlots);
							updateQties(sourcePpsItem, result.data.sourceQties, prodSetQtySlots);
							// ppsItemDataService.markItemAsModified(target);
							ppsItemDataService.gridRefresh();
						}
					});
			}
		}

		this.updateProductionsetQties = updateProductionsetQties;
	}

})(angular);
