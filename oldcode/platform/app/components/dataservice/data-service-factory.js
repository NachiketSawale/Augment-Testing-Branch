(function (angular) {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('platform').factory('platformDataServiceFactory', ['_', '$rootScope', '$q', 'platformHeaderDataInformationService', 'platformDataServiceTranslationExtension', 'platformModalService',
		'cloudDesktopSidebarService',
		'platformObjectHelper', 'platformDataServiceSelectionExtension', 'platformDataServiceDataProcessorExtension', 'platformDataServiceItemFilterExtension',
		'platformDataServiceNavigationExtension', 'platformDataServiceRowReadonlyExtension', 'platformDataServiceItemCssClassExtension', 'platformDataServiceActionExtension', 'platformDataServiceInitOptionExtension',
		'platformDataServiceShowRemarksExtension', 'platformDataServiceSidebarSearchExtension', 'platformDataServiceHttpResourceExtension', 'platformDataServiceModificationTrackingExtension',
		'platformDataServiceEntitySortExtension', 'platformDataServiceDataPresentExtension', 'platformDataServiceEntityRoleExtension', 'platformDataServiceSidebarInquiryExtension', 'platformTranslateService',
		'platformDataServiceItemCellFocusExtension', 'platformDataServiceSidebarWatchListExtension', 'platformGenericStructureService', 'platformDataServiceEventExtension',
		'platformDataServiceConfiguredCreateExtension',

		function (_, $rootScope, $q, platformHeaderDataInformationService, platformDataServiceTranslationExtension, platformModalService, cloudDesktopSidebarService,
			platformObjectHelper, platformDataServiceSelectionExtension, platformDataServiceDataProcessorExtension, platformDataServiceItemFilterExtension,
			platformDataServiceNavigationExtension, platformDataServiceRowReadonlyExtension, platformDataServiceItemCssClassExtension, platformDataServiceActionExtension,
			platformDataServiceInitOptionExtension, platformDataServiceShowRemarksExtension, platformDataServiceSidebarSearchExtension, platformDataServiceHttpResourceExtension, platformDataServiceModificationTrackingExtension,
			platformDataServiceEntitySortExtension, platformDataServiceDataPresentExtension, platformDataServiceEntityRoleExtension, platformDataServiceSidebarInquiryExtension,
			platformTranslateService, platformDataServiceItemCellFocusExtension, platformDataServiceSidebarWatchListExtension, platformGenericStructureService, platformDataServiceEventExtension,
			platformDataServiceConfiguredCreateExtension) {

			var service = {};

			function doNothingHook() {
			}

			function createAllTheStuffNotClassiefiedYet(container, options) {

				container.data.registerAndCreateEventMessenger('selectionAfterSort');
				container.data.registerAndCreateEventMessenger('dataModified');
				container.data.filter = '';
				container.data.moveItem = doNothingHook;

				container.data.getModuleOfService = function getModuleOfService() {
					return options.module;
				};

				container.data.getImplementedService = function getImplementedService() {
					return container.service;
				};

				container.data.setFilter = function setFilter(filter) {
					container.data.filter = filter;
				};

				container.data.disableWatchSelected = function disableWatchSelected(data) {
					if (data.doWatchSelected) {
						data.doWatchSelected();
					}
				};

				container.data.enableWatchSelected = function enableWatchSelected(selectedItem, data) {
					if (data.markItemAsModified) {
						data.doWatchSelected = $rootScope.$watch(function () {
							return selectedItem;
						}, function (newItem, oldItem) {
							if (newItem && oldItem && newItem.Id === oldItem.Id && newItem !== oldItem) {
								data.markItemAsModified(selectedItem, data);
							}
						}, false);
					}
				};

				container.data.doReadData = function doReadData(data, isReadingDueToRefresh) {
					data.listLoadStarted.fire();

					if (_.isFunction(container.service.disableFilteringByModelObjects)) {
						container.service.disableFilteringByModelObjects();
					}

					var mayRequireModelObjectFilter = (function checkModelObjectFilterRequired() {
						if (!container.data.enhanceFilterByModelObjectSelection) {
							return false;
						}
						if (!container.data.filterByViewerManager || !container.data.filterByViewerManager.isActive()) {
							return false;
						}
						return true;
					})();

					if (data.usesCache && data.currentParentItem && data.currentParentItem.Id && !mayRequireModelObjectFilter) {
						var cache = data.provideCacheFor(data.currentParentItem.Id, data);

						if (cache) {
							data.onReadSucceeded(cache.loadedItems, data);

							return $q.when(cache.loadedItems);
						}
					}

					var readData = {};
					readData.filter = '';

					if (data.initReadData) {
						data.initReadData(readData, data);

						if (data.enhanceReadDataByModelObjectSelection) {
							if (data.usePostForRead) {
								data.enhanceReadDataByModelObjectSelection(readData, data);
							} else {
								data.enhanceFilterByModelObjectSelection(readData, data);
							}
						}
					} else if (data.filter) {
						readData.filter = '?' + data.filter;

						if (data.enhanceFilterByModelObjectSelection) {
							data.enhanceFilterByModelObjectSelection(readData, data);
						}
					} else if (data.sidebarSearch) {

						if (cloudDesktopSidebarService.checkStartupFilter()) {
							return null;
						}
						var params = _.cloneDeep(cloudDesktopSidebarService.filterRequest.getFilterRequestParamsOrDefault(data.searchFilter));
						if (options.entityRole && options.entityRole.root) {
							if (options.entityRole.root.useIdentification) {
								_.forEach(params.PinningContext, function (pItem) {
									var pId = pItem.id;
									if (_.isNumber(pId)) {
										pItem.id = {Id: pId};
									}
								});
								if (params.PKeys && params.PKeys.length > 0) {
									var tmp = [];
									_.forEach(params.PKeys, function (pItem) {
										if (!_.isObject(pItem)) {
											tmp.push({Id: pItem});
										}
									});
									params.PKeys = tmp;
								}
							} else {
								_.forEach(params.PinningContext, function (pItem) {
									var pId = pItem.id;
									if (!_.isNumber(pId) && _.isObject(pId)) {
										pItem.id = pId.Id;
									}
								});
								if (params.ProjectContextId && !_.isNumber(params.ProjectContextId) && _.isObject(params.ProjectContextId)) {
									params.ProjectContextId = params.ProjectContextId.Id;
								}
							}
						}
						angular.extend(readData, params);

						// TODO: remove initReadData above, if no usages in modules anymore
						// used for smooth migration to replace initReadData option
						// problem: at the moment if initReadData is used filter/sidebarSearch are ignored!
						if (_.isFunction(data.extendSearchFilter)) {
							readData.isReadingDueToRefresh = !!isReadingDueToRefresh;
							data.extendSearchFilter(readData, data);
							readData.isReadingDueToRefresh = false;
						}

						if (data.isRoot && platformGenericStructureService.isFilterEnabled()) {
							var groupingFilter = platformGenericStructureService.getGroupingFilterRequest();

							if (groupingFilter) {
								readData.groupingFilter = groupingFilter;
							}
						}
					}

					return container.data.doCallHTTPRead(readData, data, data.onReadSucceeded);
				};

				// order new created items for hierarchy tree along with children
				container.data.orderCreatedItems = function orderCreatedItems(list) {
					var input = list;
					var childProp = container.data.treePresOpt.childProp;
					var parentProp = container.data.treePresOpt.parentProp;
					var newCreatedParent = {};
					var newCreatedChild = {};

					for (var i = 0; i < input.length; i++) {
						if (input[i].Version === 0 && input[i][parentProp] === null) {
							newCreatedParent = input[i];
							break;
						} else if (input[i].Version === 0 && input[i][parentProp] !== null) {
							newCreatedChild = input[i];
							break;
						}
						if (input[i][childProp] && input[i][childProp].length > 0) {
							container.data.orderCreatedItems(input[i][childProp]);
						}
					}
					if (angular.isDefined(newCreatedParent.Id) || angular.isDefined(newCreatedChild.Id)) {
						container.data.setCreatedItem(newCreatedParent, newCreatedChild);
					}
				};

				// set new created item position after sorting
				/* jshint -W074 */ // For me there is no cyclomatic complexity
				container.data.setCreatedItem = function setCreatedItem(newCreatedParent, newCreatedChild) {

					var childProp = container.data.treePresOpt.childProp;
					var parentProp = container.data.treePresOpt.parentProp;
					var list = container.data.itemTree;
					var item = _.find(list, {Version: 0});
					var index;
					if (item) {
						index = list.indexOf(item);
					}
					if (index) {
						list.splice(index, 1);
					}
					if (angular.isDefined(newCreatedParent) && angular.isDefined(newCreatedParent.Id)) {
						if (item.Id === newCreatedParent.Id && item.Version === 0) {
							if (!_.find(list, {Version: 0})) {
								list.push(item);
							}
						}
					}

					if (angular.isDefined(newCreatedChild) && angular.isDefined(newCreatedChild.Id)) {
						var parent = _.find(container.data.itemList, {Id: newCreatedChild[parentProp]});
						var childList = parent[childProp];
						item = _.find(childList, {Version: 0});

						if (item) {
							index = childList.indexOf(item);
						}
						if (index) {
							childList.splice(index, 1);
						}
						if (item.Id === newCreatedChild.Id && item.Version === 0) {
							if (!_.find(childList, {Version: 0})) {
								childList.push(item);
							}
						}
					}
				};

				container.data.getItemById = function getItemById(id, data) {
					return _.find(data.itemList, {Id: id});
				};

				container.service.gridRefresh = function gridRefresh() {
					container.data.dataModified.fire();
				};

				container.service.setFilter = container.data.setFilter;

				container.service.moveItem = container.data.moveItem;

				container.service.getDefault = function getDefault() {
					return {};
				};

				container.service.getItemById = function getItemById(Id) {
					return container.data.getItemById(Id, container.data);
				};

				container.data.getService = function getService() {
					return container.service;
				};

				container.service.getServiceName = function getServiceName() {
					return options.serviceName;
				};

				container.service.getEntityTranslationId = function getEntityTranslationId() {
					return options.entityNameTranslationID;
				};

				container.service.getTranslatedEntityName = function getTranslatedEntityName() {
					if (options.entityNameTranslationID && !container.data.translatedEntityName) {
						container.data.translatedEntityName = platformTranslateService.instant(options.entityNameTranslationID, null, true);
					}

					return container.data.translatedEntityName || options.serviceName;
				};

			}

			/* jshint -W074 */ // For me there is no cyclomatic complexity
			function createElementFromScratch(container, options) {
				platformDataServiceEventExtension.addEventBaseFunctionality(container);

				createAllTheStuffNotClassiefiedYet(container, options);

				platformDataServiceHttpResourceExtension.addHttpResources(container, options);

				// always add history data processor
				platformDataServiceDataProcessorExtension.addHistoryDataProcessor(container);
				platformDataServiceDataProcessorExtension.addSpecifiedDataProcessor(container, options);

				platformDataServiceModificationTrackingExtension.addModificationTracking(container, options);

				platformDataServiceRowReadonlyExtension.addRowReadonly(container);
				platformDataServiceItemCssClassExtension.addItemCssClass(container);

				platformDataServiceDataPresentExtension.addEntityPresentation(container, options);

				platformDataServiceEntitySortExtension.addEntitySorting(container, options);

				platformDataServiceItemFilterExtension.addItemFilter(container, options);
				platformDataServiceTranslationExtension.addEntityTranslation(container, options);
				platformDataServiceSelectionExtension.addEntitySelection(container, options);

				platformDataServiceNavigationExtension.addEntityNavigation(container);

				platformDataServiceEntityRoleExtension.addEntityRole(container, options);

				platformDataServiceActionExtension.addEntityActions(container, options);
				platformDataServiceConfiguredCreateExtension.addConfiguredCreationToService(container, options);
				platformDataServiceSidebarSearchExtension.addSidebarSearch(container, options);
				platformDataServiceSidebarInquiryExtension.addSidebarInquiry(container, options);  // 11.Jun.2015@rei added
				platformDataServiceSidebarWatchListExtension.addSidebarWatchList(container, options);  // 2.12.2015@rei added
				platformDataServiceShowRemarksExtension.addRemarkPresenter(container, options);

				platformDataServiceItemCellFocusExtension.addItemCellFocus(container, options);

				return container;
			}

			/* jshint -W074 */ // For me there is no cyclomatic complexity
			service.createNewComplete = function createNewComplete(options) {
				var opt = platformDataServiceInitOptionExtension.completeOptions(options);
				var container = {data: {}, service: {}};
				return createElementFromScratch(container, opt);
			};

			/* jshint -W074 */ // For me there is no cyclomatic complexity
			service.createService = function createService(options, servBase) {
				var opt = platformDataServiceInitOptionExtension.completeOptions(options);
				var container = {data: {}, service: servBase};
				return createElementFromScratch(container, opt);
			};

			return service;
		}]);
})(angular);
