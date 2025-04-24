/**
 * Created by waz on 2/23/2018.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc factory
	 * @name basicsCommonBaseDataServiceBasicExtension
	 * @deprecated
	 * This extension is deprecated, please try to use basicsCommonBaseDataServiceReferenceExtension instead.
	 * @description
	 * Extension for data service's basics methods
	 */
	const moduleName = 'basics.common';
	const module = angular.module(moduleName);
	module.factory('basicsCommonBaseDataServiceBasicExtension', BasicsCommonBaseDataServiceBasicExtension);

	BasicsCommonBaseDataServiceBasicExtension.$inject = ['platformDataServiceDataProcessorExtension', '_'];

	function BasicsCommonBaseDataServiceBasicExtension(platformDataServiceDataProcessorExtension, _) {

		function addBasics(container) {
			const service = container.service;
			_.extend(container.service, {
				'appendLoadedItems': appendLoadedItems,
				'removeLoadedItems': removeLoadedItems,
				'moveLoadedItems': moveLoadedItems,
				'updateLoadedItem': updateLoadedItem,
				'setLoadedItems': setLoadedItems
			});

			/**
			 * Append list loaded items, not saveable
			 * @param items
			 */
			function appendLoadedItems(items) {
				if (container.data.entityCreated) {
					_.forEach(items, function (item) {
						// it will trigger create item
						container.data.entityCreated.fire(null, item);
					});
				} else {
					setLoadedItems(_.concat(container.data.itemList, items));
				}
			}

			/**
			 * remove list loaded items, not saveable
			 * @param items
			 */
			function removeLoadedItems(items) {
				if (container.data.entityDeleted) {
					container.data.entityDeleted.fire(null, items);
				}
				const ids = _.map(items, function (item) {
					return item.Id;
				});

				setLoadedItems(_.filter(container.data.itemList, function (item) {
					return !_.includes(ids, item.Id);
				}));
			}

			/**
			 * Move loaded items to target data service, not saveable
			 * @param items
			 * Need move items
			 * @param targetService
			 * Target data service
			 * @param convertor
			 * @optional
			 * A convertor for moveItems when move finish
			 */
			function moveLoadedItems(items, targetService, convertor) {
				removeLoadedItems(items);

				let appendItems = items;
				if (convertor) {
					appendItems = convertor(items);
				}

				targetService.appendLoadedItems(appendItems);
				service.deselect();
			}

			/**
			 * Update loaded item, not saveable
			 * @param item
			 */
			function updateLoadedItem(item) {
				const data = container.data;
				const i = _.findIndex(data.itemList, {Id: item.Id});

				const updateItem = _.cloneDeep(item);
				platformDataServiceDataProcessorExtension.doProcessItem(updateItem, data);
				if (!_.isEqual(data.itemList[i], item)) {
					data.itemList[i] = updateItem;
					data.itemModified.fire(null, updateItem);
				}
				service.gridRefresh();

				if (container.data.usesCache) {
					updateCacheItem(item);
				}
			}

			/**
			 * Set loaded items, not saveable
			 * @param list
			 */
			function setLoadedItems(list) {
				const data = container.data;

				const updateList = _.cloneDeep(list);
				_.forEach(updateList, function (item) {
					platformDataServiceDataProcessorExtension.doProcessItem(item, data);
					data.itemModified.fire(null, item);
				});
				data.itemList = updateList;
				data.listLoaded.fire(data.itemList);

				if (data.usesCache) {
					storeInCache(container);
				}
			}

			function storeInCache(container) {
				const cacheId = service.parentService().getSelected().Id;
				if (!container.data.cache[cacheId]) {
					container.data.storeCacheFor(service.parentService().getSelected(), container.data);
				} else {
					container.data.cache[cacheId].loadedItems = _.cloneDeep(container.data.itemList);
				}
			}

			function updateCacheItem(item) {
				_.forEach(container.data.cache, function (cache) {
					const i = _.findIndex(cache.loadedItems, {Id: item.Id});
					if (i !== -1) {
						cache.loadedItems[i] = item;
					}
				});
			}
		}

		return {
			addBasics: addBasics
		};
	}
})(angular);