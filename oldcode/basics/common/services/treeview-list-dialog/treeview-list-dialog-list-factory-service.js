/**
 * Created by lid on 7/4/2017.
 */

/*  globals, angular */
(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('treeviewListDialogListFactoryService', TreeviewListDialogListFactoryService);
	TreeviewListDialogListFactoryService.$inject = ['$http', '$log', '$q', '$injector', 'PlatformMessenger', 'platformDataServiceFactory', '_'];

	function TreeviewListDialogListFactoryService($http, $log, $q, $injector, PlatformMessenger, platformDataServiceFactory, _) {

		const serviceFactroy = {};
		const serviceCache = {};

		serviceFactroy.createNewComplete = function createNewComplete(moduleId, serviceOption, foreignKeyName, treeviewService, isReturnContainer) {
			const serviceBaseOption = {
				flatRootItem: {
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead
						}
					},
					useItemFilter: true
				}
			};
			if (serviceOption && serviceOption.flatRootItem) {
				angular.extend(serviceOption.flatRootItem, serviceBaseOption.flatRootItem);
			}
			const serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);

			const service = serviceContainer.service;

			service.setList = function setList(items) {
				// the serviceContainer should be readonly, it needn't to set modifications
				serviceContainer.data.selectedItem = null;
				serviceContainer.data.itemList.length = 0;
				_.forEach(items, function (item) {
					serviceContainer.data.itemList.push(item);
					// serviceContainer.data.markItemAsModified(item, data);   // set new items as modified
				});
				serviceContainer.data.listLoaded.fire();
			};

			const data = serviceContainer.data;
			const multipleSelected = {};
			let options = {isInit: true};
			data.updateOnSelectionChanging = null;
			if (service.setShowHeaderAfterSelectionChanged) {
				service.setShowHeaderAfterSelectionChanged(null);
			}
			data.doNotLoadOnSelectionChange = true;
			data.clearContent = function clearContent() {
			};

			let allItems = [];
			let filter = '';
			let reloadData = false;

			angular.extend(service, {
				setAllItems: setALlItems,
				getAllItems: getAllItems,
				getItemById: getItemById,
				loadAllItems: loadAllItems,
				filterItems: filterItems,

				init: init,
				isInit: isInit,
				getIsInit: getIsInit,
				doNotLoadOnSelectionChange: doNotLoadOnSelectionChange,
				refresh: refresh,
				search: search,
				clearSearch: clearSearch,
				getOptions: getOptions,
				getItemsByCodeDescription: getItemsByCodeDescription,

				onMultipleSelection: onMultipleSelection,
				getMultipleSelectedItems: getMultipleSelectedItems,
				setMultipleSelectedItems: setMultipleSelectedItems,
				getIsListBySearch: getIsListBySearch,
				setIsListBySearch: setIsListBySearch,
				setReloadData: setReloadData,
				resetMultipleSelection: new PlatformMessenger(),
				showLoadingIndicator: new PlatformMessenger()
			});

			angular.extend(multipleSelected, {
				items: [],
				isListBySearch: false
			});
			if (isReturnContainer) {
				return serviceContainer;
			} else {
				return service;
			}

			function setALlItems(list) {
				allItems = list;
			}

			function getAllItems() {
				let result = $q.defer();
				let readUrl = serviceContainer.data.httpReadRoute + serviceContainer.data.endRead;
				if (serviceOption.getUrlFilter) {
					filter = serviceOption.getUrlFilter();
					readUrl += '?' + filter;
				}

				$http({
					method: serviceOption.flatRootItem.httpRead && serviceOption.flatRootItem.httpRead.usePostForRead ? 'POST' : 'GET',
					url: readUrl,
					data: serviceOption.getUrlFilter()
				}).then(function success(response) {
					result.resolve(response.data);
				}, function error(error) {
					$log.error('fail to load data,' + readUrl);
					result.reject(error);
					result = null;
				});
				return result.promise;
			}

			function getItemById(id) {
				return _.find(allItems, {Id: id});
			}

			function loadAllItems() {
				const defer = $q.defer();
				if (reloadData || _.isEmpty(allItems) || (filter !== '' && filter !== serviceOption.getUrlFilter())) {
					getAllItems().then(function (data) {
						defer.resolve(data);
						allItems = data || [];
					});
				} else {
					defer.resolve(allItems);
				}
				return defer.promise;
			}

			function filterItems(list) {
				const unfilteredList = list || getUnfilteredList;
				const listFilteredByItem = filterByItem(unfilteredList);

				return filterByCircularDependency(listFilteredByItem);
			}

			function init(opts) {
				options = opts;
			}

			function isInit(value) {
				options.isInit = value;
			}

			function getOptions() {
				return options;
			}

			function getIsInit() {
				return options.isInit;
			}

			function doNotLoadOnSelectionChange(loadOnSelectionChange) {
				data.doNotLoadOnSelectionChange = loadOnSelectionChange;
			}

			function refresh() {
				allItems = [];
				return loadAllItems();
			}

			function search(searchString) {

				options.searchString = searchString && searchString.length > 0 ? searchString.toLowerCase() : '';

				if (treeviewService) {
					const categorySelected = treeviewService.getSelected();

					if (categorySelected && categorySelected.Id) {
						// if category is selected and search string has value, search only affects to items from the selected category
						// 1. display only category selected
						treeviewService.setItemFilter(function (itemCatEntity) {
							return itemCatEntity.Id === categorySelected.Id;
						});
						treeviewService.enableItemFilter(true);

						service.isInit(true);
						// 2. search items from selected category //workaround for setSelected
						treeviewService.setSelected({}).then(function () {
							treeviewService.setSelected(categorySelected).then(function () {
								service.filterItems(null).then(function (filteredItems) {
									service.setItemFilter(getItemsByCodesDescriptionFilterFn);
									service.isInit(false);
									service.setList(filteredItems);
									service.enableItemFilter(true);
								});
							});
						});
					} else {
						const list = getUnfilteredList();
						const listFilteredByCategories = filterByCategories(list);
						const listSearchByCodeDescription = getItemsByCodeDescription(options.searchString, listFilteredByCategories);
						const listFilteredByItem = filterByItem(listSearchByCodeDescription);
						filterByCircularDependency(listFilteredByItem).then(function (listFilteredByCircularDependency) {
							service.setList(listFilteredByCircularDependency);
							const filteredItemList = service.getList();

							treeviewService.fireItemFiltered(filteredItemList, foreignKeyName);
						});
					}
				} else {
					const listE = getUnfilteredList();
					const listSearchByCodeDescriptionE = getItemsByCodeDescription(options.searchString, listE);
					const listFilteredByItemE = filterByItem(listSearchByCodeDescriptionE);
					filterByCircularDependency(listFilteredByItemE).then(function (listFilteredByCircularDependency) {
						service.setList(listFilteredByCircularDependency);

					});
				}
			}

			function clearSearch() {
				options.searchString = '';
			}

			function onMultipleSelection(grid, rows) {

				const items = rows.map(function (row) {
					return grid.instance.getDataItem(row);
				});

				_.forEach(service.getList(), function (item) {
					_.remove(multipleSelected.items, {'Id': item.Id});
				});
				_.forEach(items, function (item) {
					if (item && item.Id) {
						multipleSelected.items.push(item);
					}
				});

				return multipleSelected.items;
			}

			function getMultipleSelectedItems() {
				return multipleSelected.items;
			}

			function setMultipleSelectedItems(items) {
				multipleSelected.items = items;
			}

			function getIsListBySearch() {
				return multipleSelected.isListBySearch;
			}

			function setIsListBySearch(value) {
				multipleSelected.isListBySearch = value;
			}

			function setReloadData(value) {
				reloadData = value;
			}

			function getUnfilteredList() {
				return allItems;
			}

			function filterByCategories(itemlist) {// filter item by cats.
				const categories = treeviewService.getFilteredList(options);
				const filteredCategories = _.uniq(_.map(categories, 'Id'));// because options filter is null,so filteredCategories have all cats.

				// filter items
				return _.filter(itemlist, function (item) {
					if (foreignKeyName === 'ProductDescriptionFk') {
						return filteredCategories.indexOf(item[foreignKeyName] * 10 + 4) !== -1;
					} else {
						return filteredCategories.indexOf(item[foreignKeyName]) !== -1;
					}
				});
			}

			function filterByItem(list) {
				const lookupOptions = options.lookupOptions;
				if (lookupOptions && lookupOptions.filterItemKey) {
					const filter = $injector.get('basicsLookupdataLookupFilterService').getFilterByKey(lookupOptions.filterItemKey);
					return list.filter(filter.fn);
				}
				return list;
			}

			function filterByCircularDependency(list) {
				list = list || [];
				const defer = $q.defer();

				defer.resolve(list);
				return defer.promise;
			}

			function getItemsByCodesDescriptionFilterFn(item) {
				let result = false;
				const searchKeyword = options.searchString;

				if (searchKeyword.length === 0) {
					return true;
				}

				if (angular.isDefined(item.Code) && item.Code) {
					const code = item.Code.toLowerCase();
					result = code.indexOf(searchKeyword) >= 0;
				}

				if (angular.isDefined(item.DescriptionInfo) && item.DescriptionInfo.Translated) {
					const descInfo = item.DescriptionInfo.Translated.toLowerCase();
					result = result || descInfo.indexOf(searchKeyword) >= 0;
				}

				// For ResRequisition Dialog
				if (angular.isDefined(item.Description)) {
					if (!item.Description) {
						result = !searchKeyword;
					} else {
						const desc = item.Description.toLowerCase();
						result = result || desc.indexOf(searchKeyword) >= 0;
					}
				}

				return result;
			}

			function getItemsByCodeDescription(searchString, list) {
				return _.filter(list, getItemsByCodesDescriptionFilterFn);
			}

			function incorporateDataRead(readData, data) {
				readData = readData || [];

				// update the items cache
				_.each(readData, function (item) {
					const itemTemp = getItemById(item.Id);
					if (angular.isUndefined(itemTemp)) {
						allItems.push(item);
					}
				});
				filterItems(readData).then(function (listFilteredByCircularDependency) {
					return data.handleReadSucceeded(listFilteredByCircularDependency, data);
				});
			}
		};

		// get service or create service by module name
		serviceFactroy.getService = function getService(moduleId, serviceOption, treeviewConfig, isReturnContainer) {

			if (!serviceCache[moduleId]) {
				if (treeviewConfig) {
					serviceCache[moduleId] = serviceFactroy.createNewComplete(moduleId, serviceOption, treeviewConfig.foreignKeyName, treeviewConfig.treeviewService, isReturnContainer);
				} else {
					serviceCache[moduleId] = serviceFactroy.createNewComplete(moduleId, serviceOption, undefined, undefined, isReturnContainer);
				}
			}
			return serviceCache[moduleId];
		};
		return serviceFactroy;

	}

})(angular);