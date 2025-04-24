/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/* global _ */

	let moduleName = 'estimate.main';
	/**
	 * this module will be called when using material-neutral-material-ai-mapping-lookup.js
	 */
	angular.module(moduleName).factory('estimateMainLineItemsBoqAiMappingDataService',
		['$q', '$http', 'platformTranslateService', 'estimateMainLineItemsBoqAiMappingService',
			function ($q, $http, platformTranslateService, estimateMainLineItemsBoqAiMappingService) {
				let dataCache = {};
				let groupId = null;
				let extraData = {};

				function fillCache(Mainlist, MatchedList) {
					/**
					 * Mainlist stands for the "data.Main" list
					 * MatchedList stands for the target list, which is the data.BoqItem in this case
					 * The two lists are binded by "data.Main._.MatchedBoqFks == data.BoqItem._.Id
					 */
					if (Mainlist !== null && Mainlist.length > 0) {
						_.forEach(Mainlist, function (entry) {
							let FKs = entry.MatchedBoqFks;
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
							// fillCache(entry.BoqItems, MatchedList);
						});
					}
				}

				function attachData(data) {
					fillCache(data.Main, data.BoqItem);
				}

				function getList() {
					let selectedId = estimateMainLineItemsBoqAiMappingService.getSelectedId();
					return dataCache[selectedId];
				}

				function getCachedList(itemId) {
					return dataCache[itemId];
				}

				function attachExtraData(data) {
					let selectedId = estimateMainLineItemsBoqAiMappingService.getSelectedId();
					let groupExtraData = extraData[selectedId];
					let item = _.find(groupExtraData, {Id: data.Id});
					if (!item) {
						groupExtraData.push(data);
					}
				}

				function getExtraList() {
					let selectedId = estimateMainLineItemsBoqAiMappingService.getSelectedId();
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
