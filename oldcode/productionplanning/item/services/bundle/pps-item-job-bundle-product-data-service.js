(function (angular) {
	'use strict';
	/* global globals, _ */
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).service('productionplanningItemJobBundleProductDataService', JobBundleProductDataService);

	JobBundleProductDataService.$inject = ['$injector', '$http', '$q', 'moment',
		'platformModuleStateService',
		'platformDataServiceFactory',
		'productionplanningItemJobBundleDataService',
		'platformGridAPI',
		'productionplanningCommonProductProcessor'];

	function JobBundleProductDataService($injector, $http, $q, moment,
		platformModuleStateService,
		platformDataServiceFactory,
		jobBundleDataService,
		platformGridAPI,
		productionplanningCommonProductProcessor) {

		let grid = {};

		let serviceInfo = {
			flatNodeItem: {
				module: moduleName,
				serviceName: 'productionplanningItemJobBundleProductDataService',
				entityNameTranslationID: 'productionplanning.item.entityJobBundleProduct',
				httpRead: {
					route: globals.webApiBaseUrl + 'productionplanning/common/product/',
					endRead: 'customlistbyforeignkey',
					initReadData: function initReadData(readData) {
						const Id = jobBundleDataService.getSelected().Id || -1;
						readData.filter = `?foreignKey=TrsProductBundleFk&mainItemId=${Id}`;
					}
				},
				dataProcessor: [{processItem: productionplanningCommonProductProcessor.processItemSvg}],
				entityRole: {
					node: {
						itemName: 'Product',
						parentService: jobBundleDataService,
						doesRequireLoadAlways: true
					}
				},
				actions: {delete: true, create: false},
				presenter: {
					list: {
						incorporateDataRead: (readData, data) => {
							const list = readData.Main || [];
							setTimeout(function () {
								refreshGrid(list);
							}, 150);
							return container.data.handleReadSucceeded(list, data);
						}
					}
				}
			}
		};

		let container = platformDataServiceFactory.createNewComplete(serviceInfo);
		let service = container.service;
		container.data.usesCache = false;
		container.data.ignoreNextSelectionChangeForUpdate = true;
		container.data.supportUpdateOnSelectionChanging = false;

		service.setGrid = (scopeGrid) =>{
			grid = scopeGrid;
		};

		service.resortSequence = (list) =>{
			const defer = $q.defer();
			let sourceIndex = grid.instance.getSelectedRows()[0];
			_.forEach(list,(product, index) => {
				product.Sequence = index + 1;
				product.UpdateSequence = true;
			});
			customMarkItemsAsModified(list);

			refreshGrid(list, sourceIndex);
			defer.resolve(list);
			return defer.promise;
		};

		service.moveUp = function () {
			const originList = angular.copy(grid.dataView.getRows());
			service.resortSequence(originList).then((list) =>{
				let sourceIndex = grid.instance.getSelectedRows()[0];
				let sourceItem = list[sourceIndex];
				let targetIndex = sourceIndex - 1;
				let targetItem = list[targetIndex];
				if (!sourceItem || !(targetItem && targetItem.Sequence !== null) || sourceIndex === 0) {
					return;
				}
				swapProducts(sourceItem, targetItem);
				refreshGrid(list, sourceIndex - 1);

				customMarkItemAsModified(sourceItem);
				customMarkItemAsModified(targetItem);
			});
		};

		service.moveDown = function () {
			const originList = angular.copy(grid.dataView.getRows());
			service.resortSequence(originList).then((list) => {
				let sourceIndex = grid.instance.getSelectedRows()[0];
				let sourceItem = list[sourceIndex];
				let targetIndex = sourceIndex + 1;
				let targetItem = list[targetIndex];
				if (!sourceItem || !(targetItem && targetItem.Sequence !== null) || sourceIndex === list.length - 1) {
					return;
				}
				swapProducts(sourceItem, targetItem);
				refreshGrid(list, sourceIndex + 1);
				customMarkItemAsModified(sourceItem);
				customMarkItemAsModified(targetItem);
			});
		};

		function swapProducts(sourceItem, targetItem) {
			const temp = angular.copy(sourceItem);
			sourceItem.Sequence = targetItem.Sequence;
			sourceItem.UpdateSequence = true;
			targetItem.Sequence = temp.Sequence;
			targetItem.UpdateSequence = true;
		}

		function refreshGrid(oldList, selectedIndex) {
			const newList = _.orderBy(oldList, ['Sequence']);
			grid.dataView.setItems(newList);
			grid.instance.setSelectedRows([selectedIndex]);
			grid.instance.resetActiveCell();
			platformGridAPI.grids.commitAllEdits();
			platformGridAPI.grids.refresh(grid.id, true);

			container.data.itemList = newList;
			service.gridRefresh();
		}

		function customMarkItemsAsModified(Items) {
			Items.forEach(item => { customMarkItemAsModified(item); });
		}

		function customMarkItemAsModified(sourceItem) {
			const modifications = platformModuleStateService.state(service.getModule()).modifications;
			if (modifications.EntitiesCount > 0) {
				const JobBundleToSave = _.get(modifications, 'JobBundleToSave');
				const productToSave = _.map(JobBundleToSave[0].ProductToSave);
				const originSourceItem = _.find(productToSave, (item) => item.Product.Id === sourceItem.Id);
				if (originSourceItem) {
					angular.extend(originSourceItem.Product, sourceItem);
				}else {
					service.markItemAsModified(sourceItem);
				}
			} else {
				service.markItemAsModified(sourceItem);
			}
		}

		service.onValueChanged = function (selected, column) {
			switch (column) {
				case 'Sequence':
					selected.UpdateSequence = true;
					service.markItemAsModified(selected);
					break;
			}
		};

		service.deleteFn = function () {
			$injector.get('productionplanningItemProductLookupDataService').addBackItems(service.getSelectedEntities());
			customMarkItemsAsModified(service.getSelectedEntities());
			const productIds = _.map(service.getSelectedEntities(), 'Id');
			_.remove(container.data.itemList, function (item) {
				return _.includes(productIds, item.Id);
			});

			service.resortSequence(container.data.itemList).then((list) => {
				service.deselect();
				grid.instance.resetActiveCell();
				grid.instance.setSelectedRows([]);
				service.gridRefresh();
				const isAnyData = container.data.itemList.length > 0;
				jobBundleDataService.doUpdateToolbar(isAnyData);
			});
		};

		service.addBackItems = function (entities) {
			const dataStorage = container.data.itemList;
			const bundle = jobBundleDataService.getSelected();
			let maxSequence = _.max(_.map(dataStorage, 'Sequence')) || 0;

			entities.forEach((item) => {
				item.PreviousTrsProductBundleFk = item.TrsProductBundleFk;
				item.TrsProductBundleFk = bundle.Id;
				item.Sequence = ++maxSequence;
				item.UpdateSequence = true;
				dataStorage.push(item);
			});
			customMarkItemsAsModified(entities);
			service.gridRefresh();
			const isAnyData = true;
			jobBundleDataService.doUpdateToolbar(isAnyData);
		};

		return service;
	}

})(angular);