/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	let moduleName = 'estimate.main';
	/**
	 * this module will be called when using material-neutral-material-ai-mapping-lookup.js
	 */
	angular.module(moduleName).factory('estimateMainLineItemsActivityAiMappingDataService', ['_', '$q', '$http', 'estimateMainLineItemsActivityAiMappingService',
		function (_, $q, $http, estimateMainLineItemsActivityAiMappingService) {
			let dataCache = {};
			let groupId = null;
			let extraData = {};

			function fillCache(Mainlist, MatchedList) {
				/**
				 * Mainlist stands for the "data.Main" list
				 */
				if (Mainlist !== null && Mainlist.length > 0) {
					_.forEach(Mainlist, function (entry) {
						let FKs = entry.MatchedActivityFks;
						let MatchedItems = [];
						if (FKs !== null && FKs.length > 0) {
							_.forEach(FKs, function (FK) {
								let MatchedItem = _.find(MatchedList, {Id: FK});
								if (MatchedItem !== null) {
									MatchedItems.push(MatchedItem);
								}
							});
						}
						dataCache[entry.Id] = MatchedItems;
						extraData[entry.Id] = [];
					});
				}
			}

			function attachData(data) {
				fillCache(data.Main, data.SchedulingActivity);
			}

			function getList() {
				let selectedId = estimateMainLineItemsActivityAiMappingService.getSelectedId();
				return dataCache[selectedId];
			}

			function getCachedList(itemId) {
				return dataCache[itemId];
			}

			function attachExtraData(data) {
				let selectedId = estimateMainLineItemsActivityAiMappingService.getSelectedId();
				let groupExtraData = extraData[selectedId];
				let item = _.find(groupExtraData, {Id: data.Id});
				if (!item) {
					groupExtraData.push(data);
				}
			}

			function getExtraList() {
				let selectedId = estimateMainLineItemsActivityAiMappingService.getSelectedId();
				return extraData[selectedId];
			}

			function setFilter(dataContextId) {
				groupId = dataContextId;
			}

			function getItemById(value) {
				let itemList = dataCache[groupId];
				return _.find(itemList, {Id: value});
			}

			function getItemByIdAsync(value, options) {
				let deferred = $q.defer();
				deferred.resolve(getItemById(value, options));
				return deferred.promise;
			}

			return {
				attachData: attachData,
				attachExtraData: attachExtraData,
				setFilter: setFilter,
				getItemById: getItemById,
				getItemByIdAsync: getItemByIdAsync,
				getList: function () {
					let defer = $q.defer();
					defer.resolve(getList());
					return defer.promise;
				},
				getItemByKey: function (value) {
					let item = _.find(getList(), {Id: value});
					if (!item) {
						item = _.find(getExtraList(), {Id: value});
					}
					let deferred = $q.defer();
					deferred.resolve(item);
					return deferred.promise;
				},
				getCachedList: getCachedList
			};
		}
	]);

})(angular);
