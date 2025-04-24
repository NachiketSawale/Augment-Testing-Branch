/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerFilterMenuService
	 * @function
	 *
	 * @description Provides code to assemble the selection menu for model object filters.
	 */
	angular.module('model.viewer').factory('modelViewerFilterMenuService', ['_', '$q', '$translate',
		'modelViewerStandardFilterService', 'platformTranslateService', 'modelViewerCombinedFilterDialogService',
		'PlatformMessenger', 'modelViewerCombinedFilterService', 'modelSimulationFilterService',
		'platformModalService',
		function (_, $q, $translate, modelViewerStandardFilterService, platformTranslateService,
		          modelViewerCombinedFilterDialogService, PlatformMessenger, modelViewerCombinedFilterService,
		          modelSimulationFilterService, platformModalService) {
			var service = {};

			var combinedFilterId = 'combined';

			var allItems;
			var result;

			var translateInfo = function () {
				platformTranslateService.translateObject(this, ['title'], {
					recursive: false
				});
			};

			service.createMenu = function (config) {
				if (!_.isObject(config)) {
					throw new Error('No config supplied for filter menu.');
				}

				var privateState = {
					filterEngine: null,
					onFilterChanged: new PlatformMessenger(),
					lastCombinedFilter: _.isObject(config.combinedFilter) ? config.combinedFilter : null,
					filterSelectionFunctionsById: {},
					editCombinedFilter: function () {
						var that = this;

						return modelViewerCombinedFilterDialogService.showDialog(that.lastCombinedFilter).then(function (combinedFilterDescriptors) {
							if (combinedFilterDescriptors) {
								that.lastCombinedFilter = combinedFilterDescriptors;

								var confirmationPromise = null;
								if (privateState.filterEngine) {
									var activeFilter = privateState.filterEngine.getActiveFilter();
									if (!activeFilter || !activeFilter.isCombinedFilter) {
										confirmationPromise = platformModalService.showYesNoDialog('model.viewer.combinedFilter.activateCombinedFilter', 'model.viewer.combinedFilter.activateCombinedFilterTitle', 'no').then(function (dlgResult) {
											if (dlgResult.yes) {
												var combinedFilterItem = _.find(allItems, function (item) {
													return item.isCombinedFilterItem;
												});
												combinedFilterItem.fn();
												result.menuItem.list.activeValue = combinedFilterItem.value;
												config.menuUpdated();
											}
										});
									}
								}

								return $q.when(confirmationPromise).then(function () {
									return combinedFilterDescriptors;
								});
							} else {
								return $q.reject();
							}
						});
					}
				};

				result = {
					setFilterEngine: function (filterEngine) {
						if (privateState.filterEngine !== filterEngine) {
							privateState.filterEngine = filterEngine;
							if (filterEngine) {
								var fn = privateState.filterSelectionFunctionsById[result.menuItem.list.activeValue];
								if (_.isFunction(fn)) {
									fn();
								}
							}
						}
					},
					getFilterEngine: function () {
						return privateState.filterEngine;
					},
					registerFilterChanged: function (handler) {
						privateState.onFilterChanged.register(handler);
					},
					unregisterFilterChanged: function (handler) {
						privateState.onFilterChanged.unregister(handler);
					},
					modifyCombinedFilter: function () {
						return privateState.editCombinedFilter().then(function (combinedFilterDescriptors) {
							if (result.menuItem.list.activeValue === combinedFilterId) {
								if (privateState.filterEngine) {
									var combinedFilter = modelViewerCombinedFilterService.createFilter({
										descriptors: combinedFilterDescriptors
									});

									privateState.filterEngine.activateFilter(combinedFilter);
								}
								privateState.onFilterChanged.fire({
									filterId: result.menuItem.list.activeValue,
									combinedFilter: combinedFilterDescriptors,
									title$tr$: 'model.viewer.combinedFilter.combinedFilterMenu',
									translate: translateInfo,
									iconClass: modelViewerCombinedFilterService.getFilterIconClass()
								});
							}
							return true;
						}, function () {
							return false;
						});
					}
				};

				var standardFilters = _.map(modelViewerStandardFilterService.getFiltersForCurrentModule(), function (filter) {
					return {
						id: 'selectFilter:' + filter.id,
						caption$tr$: filter.translationKeyRoot + '.command',
						value: filter.id,
						type: 'radio',
						fn: function onFilterMenuItemClicked() {
							if (privateState.filterEngine) {
								privateState.filterEngine.activateFilter(filter);
							}
							privateState.onFilterChanged.fire({
								filterId: filter.id,
								title$tr$: filter.translationKeyRoot + '.command',
								translate: translateInfo,
								iconClass: filter.getIconClass()
							});
						}
					};
				});

				allItems = standardFilters;

				var simItems = modelSimulationFilterService.integrateMenuItems({
					menuItems: allItems,
					activateFilter: function onSimulationFilterMenuItemClicked(filter) {
						if (privateState.filterEngine) {
							privateState.filterEngine.activateFilter(filter);
						}
						privateState.onFilterChanged.fire({
							filterId: filter.id,
							title: filter.getDisplayName(),
							translate: translateInfo,
							iconClass: filter.getIconClass()
						});
					},
					menuUpdated: function () {
						if (privateState.filterEngine) {
							var activeFilter = privateState.filterEngine.getActiveFilter();
							if (activeFilter) {
								if (!service.isValidFilterId(activeFilter.id)) {
									result.menuItem.list.activeValue = 'disabled';
									var disabledFilter = modelViewerStandardFilterService.getFilterById('disabled');
									privateState.filterEngine.activateFilter(disabledFilter);
									privateState.onFilterChanged.fire({
										filterId: disabledFilter.id,
										title$tr$: 'model.viewer.filters.disabled.command',
										translate: translateInfo,
										iconClass: disabledFilter.getIconClass()
									});
								}
							}
						}
						config.menuUpdated();
					}
				});

				allItems.push({
					id: 'selectFilter:combined',
					caption$tr$: 'model.viewer.combinedFilter.combinedFilterMenu',
					value: combinedFilterId,
					type: 'radio',
					fn: function onCombinedFilterMenuItemClicked() {
						var combinedFilterPromise = privateState.lastCombinedFilter ? $q.when(privateState.lastCombinedFilter) : (function createNewCombinedFilter() {
							return privateState.editCombinedFilter();
						})();

						combinedFilterPromise.then(function combinedFilterSelected(combinedFilterDescriptors) {
							var combinedFilter = modelViewerCombinedFilterService.createFilter({
								descriptors: combinedFilterDescriptors
							});

							if (privateState.filterEngine) {
								privateState.filterEngine.activateFilter(combinedFilter);
							}
							privateState.onFilterChanged.fire({
								filterId: combinedFilterId,
								combinedFilter: combinedFilterDescriptors,
								title$tr$: 'model.viewer.combinedFilter.combinedFilterMenu',
								translate: translateInfo,
								iconClass: combinedFilter.getIconClass()
							});
						}, function noCombinedFilterSelected() {
							// TODO: else restore previous selection?
						});
					},
					isCombinedFilterItem: true
				});

				platformTranslateService.translateObject(allItems, ['caption']);

				allItems.forEach(function (item) {
					privateState.filterSelectionFunctionsById[item.value] = item.fn;
				});

				var effectiveFilterId = config.filterId;
				if (!service.isValidFilterId(effectiveFilterId)) {
					effectiveFilterId = 'disabled';
				}

				result.menuItem = {
					id: 'filterGroup',
					type: 'sublist',
					list: {
						cssClass: 'radio-group',
						showTitles: true,
						activeValue: effectiveFilterId,
						items: allItems
					}
				};

				result.destroy = function () {
					simItems.destroy();
				};

				return result;
			};

			service.isValidFilterId = function (filterId) {
				switch (filterId) {
					case combinedFilterId:
						return true;
					default:
						return modelViewerStandardFilterService.getFilterById(filterId, true) || modelSimulationFilterService.isValidFilterId(filterId);
				}
			};

			return service;
		}]);
})(angular);
