/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/*global angular */
	'use strict';

	/**
	 * @ngdoc service
	 * @name productionplanning.common:ppsCommonDataServiceSideloadExtension
	 * @function
	 * @requires
	 * @description
	 * ppsCommonDataServiceItemFilterTreeExtension adds owerwrites behaviour of platform-data-service-item-filter-extension (temporary solution!)
	 */
	angular.module('productionplanning.common').service('ppsCommonDataServiceSideloadExtension', PpsCommonDataServiceSideloadExtension);

	PpsCommonDataServiceSideloadExtension.$inject= ['PlatformMessenger', '$http', '$timeout', 'platformGridAPI', '_', 'platformDataServiceDataProcessorExtension', 'ppsCommonDataLoadService', 'platformDataServiceSelectionExtension'];

	function PpsCommonDataServiceSideloadExtension(PlatformMessenger, $http, $timeout, platformGridAPI, _, platformDataServiceDataProcessorExtension, ppsCommonDataLoadService, platformDataServiceSelectionExtension) {
		/**
		 * @ngdoc function
		 * @name addSideloadFunctionality
		 * @function
		 * @methodOf productionplanning.common.PpsCommonDataServiceSideloadExtension
		 * @description adds methods to enable sideloading data
		 * @param container {object} contains entire service and its data to be created
		 * @returns
		 */
		var extension = this;

		// options can be passed additionally
		this.addSideloadFunctionality = function addSideloadFunctionality(container, processSideload) {

			//by default dataService.getList or dataService. will only fetch items that have not been sideloaded
			var filterFn = function (item) {
				return _.isUndefined(item._visibility) || item._visibility.includes('standard');
			};
			//check if item filter is used!
			addSideloadFilter(container, filterFn);

			const sideloadCache = {
				onSideLoad : new PlatformMessenger(),
				sideLoadFilters: [],
				sideloadContainers: {},
				lastSelection: null,
				clearLastSelection: () => {
					sideloadCache.lastSelection = null;
				}
			};

			//add methods to service
			container.service.sideloadData = function (_type, parentField) {
				return extension.sideloadData(container, _type, sideloadCache, processSideload, parentField);
			};
			container.service.getSideloadFilter = function (_type) {
				return extension.getSideloadFilter(sideloadCache.sideLoadFilters, _type);
			};
			container.service.setSideloadFilter = function (_type, _filter) {
				extension.setSideloadFilter(sideloadCache.sideLoadFilters, _type, _filter);
			};
			container.service.registerSideloadContainer = function(gridId, visibility, parentField) {
				extension.registerSideloadContainer(container, gridId, visibility, sideloadCache, parentField);
			};
			container.service.unregisterSideloadContainer = function(gridId, visibility, parentField) {
				extension.unregisterSideloadContainer(container, gridId, visibility, sideloadCache, parentField);
			};
			container.service.registerSideloadEvent = function(callbackFn) {
				extension.registerSideloadEvent(sideloadCache, callbackFn);
			};
			container.service.unregisterSideloadEvent = function (callbackFn) {
				extension.unregisterSideloadEvent(sideloadCache, callbackFn);
			};
			container.service.getItemsByVisibility = function (visibility, parentField) {
				return extension.getItemsByVisibility(container, visibility, parentField);
			};
			container.service.getLastSideloadSelection = function() {
				return sideloadCache.lastSelection;
			};
		};

		//public methods
		extension.sideloadData = function sideloadData(container, _type, sideloadCache, processSideload, parentField) {
			//clear the old data before loading the new data and refreash grid
			_.each(container.data.itemList, function (item) {
				if (!_.isUndefined(item._visibility)) {
					_.pull(item._visibility, _type);
			}
			});
			//remove itemList if item._visibility is defined and its length is 0
			_.remove(container.data.itemList, function (item) {
				return _.isUndefined(item._visibility)? false : item._visibility.length === 0;
			});

			var containers = _.get(sideloadCache.sideloadContainers, _type);
			_.each(containers, function (sideLoadContainer) {
				var grid = platformGridAPI.grids.element('id', sideLoadContainer);
				if (grid && grid.dataView) {
					grid.dataView.setItems([]);
				}
			});
			//sideload data!
			var filter = sideloadCache.sideLoadFilters[_type] || {};
			return ppsCommonDataLoadService.doFetchData(container.data.httpReadRoute + container.data.endRead, filter).then(function (response) {
				var items;
				if (processSideload) {
					items = processSideload(response.data, _type, sideloadCache);
					platformDataServiceDataProcessorExtension.doProcessData(items, container.data);
				} else {
					items = ppsCommonDataLoadService.processRespone(container, response);
				}
				mergeNewData(container, items, _type, parentField);
				updateContainer(container, sideloadCache.sideloadContainers, _type, sideloadCache.lastSelection);
				// remark: for cases we need to handle sideLoad event(like preselecting specified records on container), we need to do updateContainer before firing sideLoad event.(by zwz 2021/4/29 for HP-ALM #119896)
				sideloadCache.onSideLoad.fire(null, _type);
				//reset last selection!
				sideloadCache.clearLastSelection();
				return true;
			});
		};

		extension.registerSideloadContainer = function registerSideloadContainer (container, gridId, visibility, sideloadCache, parentField) {
			//register refreshRequested to restore selection after refresh
			var onRefreshRequested = function onRefreshRequested() {
				sideloadCache.lastSelection = platformDataServiceSelectionExtension.getSelected(container.data);
			};

			if (_.has(container, 'data.refreshRequested')) {
				container.data.refreshRequested.register(onRefreshRequested);
			}

			var grid = platformGridAPI.grids.element('id', gridId);
			$timeout(function() {
				var originalSetItemsFn = grid.dataView.setItems;
				var setFilteredItems = function () {
					var filteredItems = container.service.getItemsByVisibility(visibility, parentField);
					originalSetItemsFn(filteredItems, grid.options.idProperty);
				};
				grid.dataView.setItems = setFilteredItems;
			}, 0);
			sideloadCache.sideloadContainers[visibility] = sideloadCache.sideloadContainers[visibility] || [];
			sideloadCache.sideloadContainers[visibility].push(gridId);
		};

		extension.unregisterSideloadContainer = function unregisterSideloadContainer(container, gridId, visibility, sideloadCache, parentField){
			sideloadCache.sideloadContainers[visibility] = sideloadCache.sideloadContainers[visibility] || [];
			_.pull(sideloadCache.sideloadContainers[visibility],gridId);
		};

		extension.getSideloadFilter = function getSideloadFilter(sideLoadFilters, _type) {
			return sideLoadFilters[_type]? sideLoadFilters[_type] : {};
		};
		extension.setSideloadFilter = function setSideloadFilter(sideLoadFilters, _type, _filter) {
			sideLoadFilters[_type] = _filter;
		};
		extension.registerSideloadEvent = function registerSideload(sideloadCache, callbackFn) {
			sideloadCache.onSideLoad.register(callbackFn);
			sideloadCache.clearLastSelection();
		};
		extension.unregisterSideloadEvent = function unregisterSideload(sideloadCache, callbackFn) {
			sideloadCache.onSideLoad.unregister(callbackFn);
			sideloadCache.clearLastSelection();
		};
		extension.getItemsByVisibility = function getItemsByVisibility(container, visibility, parentField) {
			if (_.isNil(parentField)) {
				return _.filter(container.data.itemList, function (item) {
					return _.isUndefined(item._visibility) ? false : item._visibility.includes(visibility);
				});
			} else {
				return _.filter(container.data.itemList, function (item) {
					return (_.isUndefined(item._visibility) ? false : item._visibility.includes(visibility)) && _.isNil(_.get(item, parentField));
				});
			}
		};

		//private methods
		function addSideloadFilter(container, filterFn) {
			//if there is an active filter, combine them
			if (container.data.itemFilter) {
				var extendedFilter = function (item) {
					return container.data.itemFilter(item) && filterFn(item);
				};
				container.service.setItemFilter(extendedFilter);
			} else {
				container.service.setItemFilter(filterFn);
			}
			if (!container.service.isItemFilterEnabled()) {
				container.service.enableItemFilter(true);
			}
		}
		function mergeNewData(container, list, visibility, parentField) {
			var partition = _.partition(list, function (item) {
				return _.map(container.data.itemList, 'Id').includes(item.Id);
			});
			var oldItemIds = _.map(partition[0], 'Id'); //items that were already in loaded data
			var newItemList = partition[1]; //items that are not it loaded data
			var disposedItemIds = [];

			// 1. search all currently loaded items
			_.forEach(container.data.itemList, function (item) {
				//no tags = standard tag
				if (_.isUndefined(item._visibility)) {
					item._visibility = ['standard'];
				}
				//if included in old items -> add tag
				if (oldItemIds.includes(item.Id)) {
					item._visibility.push(visibility);
					item._visibility = _.union(item._visibility); //remove duplicates
				}
				// else {
				// 	//if not in list and single tag -> remove item
				// 	if (item._visibility.length === 1 && item._visibility.includes(visibility)) {
				// 		disposedItemIds.push(item.Id); //collect items that are not visible anymore
				// 	}
				// 	//always pull the tag (if there is any)
				// 	_.pull(item._visibility, visibility);
				// }
			});

			// 2. add new items and set their visibility
			_.forEach(newItemList, function (item) {
				item._visibility = [visibility];
				container.data.itemList.push(item);
			});

			// 3. remove items that are not in the list anymore
			// _.remove(container.data.itemList, function (item) {
			// 	return disposedItemIds.includes(item.Id);
			// });
		}
		function updateContainer(container, sideloadContainers, visibility, lastSelection) {
			var containerList = _.get(sideloadContainers, visibility);
			var currentSelection = lastSelection ? lastSelection : container.service.getSelected();
			if (containerList) {
				_.forEach(containerList, function (gridId) {
					var grid = platformGridAPI.grids.element('id', gridId);
					grid.dataView.setItems();
					sortData(grid);
					if (currentSelection) {
						platformDataServiceSelectionExtension.doSelect(currentSelection, container.data);
						platformGridAPI.rows.selection({
							gridId: gridId,
							rows: [container.service.getSelected()]
						});
					} else if (!_.isNil(lastSelection)) {
						platformDataServiceSelectionExtension.doSelect(lastSelection, container.data);
					}
				});
			}
		}

		function sortData(grid) {
			if (grid && grid.instance && grid.options.enableColumnSort && grid.scope.sortColumn) {
				grid.instance.setSortColumn(grid.scope.sortColumn.id, grid.scope.sortColumn.ascending);
				platformGridAPI.items.sort(grid.id, grid.scope.sortColumn.field, grid.scope.sortColumn.ascending ? 'sort-asc' : 'sort-desc');
			}
		}

		return extension;
	}
})();
