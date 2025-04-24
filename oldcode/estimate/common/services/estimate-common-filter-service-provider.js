/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	/* global Platform, _ */
	let moduleName = 'estimate.common';
	/**
	 * @ngdoc service
	 * @name estimateCommonFilterServiceProvider
	 * @function
	 *
	 * @description
	 * estimateCommonFilterServiceProvider for filtering e.g. line items container by combination of several filters.
	 */
	angular.module(moduleName).factory('estimateCommonFilterServiceProvider', ['$log', '$rootScope','$injector',
		function ($log, $rootScope,$injector) {

			let FilterServiceProvider = function (moduleName, subModuleName) {
				let self = this,
					filterObjects = {},
					serviceToBeFiltered = null,
					filterFunction = null,
					toolbarItems = [],
					isFilterBoq = false;

				self.filterFunctionType = 0; // 0: Assigned, 1: assigendAndNotAssigned, 2: notAssigned

				self.onUpdated = new Platform.Messenger();
				self.onFilterButtonRemoved = new Platform.Messenger();

				function isValidDataService(dataService) {
					// probably try to use obsolete feature, when grid id was supported
					if (_.isString(dataService)) {
						$log.warn('Using grid id is not supported anymore. Please use a valid data service instance.');
						return false;
					}

					if (!_.isObject(dataService)) {
						$log.warn('Given data service instance is not an object.');
						return false;
					}

					// we have to check if necessary functions are available
					// TODO: temporary disabled function available check.
					let dataServiceInterface = [/* 'getList', 'markersChanged', 'gridRefresh', 'load', 'setItemFilter', 'enableItemFilter' */],
						missingFunctions = [];

					_.each(dataServiceInterface, function (functionName) {
						if (!_.isFunction(dataService[functionName])) {
							missingFunctions.push(functionName);
						}
					});

					if (_.size(missingFunctions) > 0) {
						$log.warn('Given data service does not provide the following function(s):\n' + missingFunctions);
						return false;
					}

					return true;
				}

				function forceRootScopeApply() {
					if ($rootScope.$root.$$phase !== '$apply' && $rootScope.$root.$$phase !== '$digest') {
						$rootScope.$apply();
					}
				}

				self.addFilter = function (id, dataService, predicate, toolbarItem, propertyName) {
					if (!isValidDataService(dataService)) {
						$log.warn('Could not add a filter. Please check your data service instance.');
						return;
					}

					filterObjects[id] = {
						predicate: predicate,
						enabled: true,
						toolbarItemId: toolbarItem.id,
						propertyName: propertyName,
						filterService: dataService
					};

					toolbarItem.caption = moduleName + '.' + subModuleName + '.' + (toolbarItem.captionId || toolbarItem.id);
					toolbarItem.type = 'check';
					toolbarItem.value = self.getFilterStatus();
					toolbarItem.fn = function deselect() {
						_.each(dataService.getList(), function (item) {
							item.IsMarked = false;
						});

						filterObjects[id].enabled = false;
						self.setFilterStatus(false);
						dataService.markersChanged([]); // remove filter
						dataService.gridRefresh();
					};

					_.remove(toolbarItems, {id: filterObjects[id].toolbarItemId});
					toolbarItems.push(toolbarItem);

					forceRootScopeApply();

					self.update();
				};

				self.getFilterStatus = function() {
					return isFilterBoq;
				};
				self.setFilterStatus = function(value){
					isFilterBoq = value;
				};

				// remove filer process:
				// 1.remove markers(filterId)
				// 2.removeFilter
				// 3.markersChangered, fre
				self.removeFilter = function (id) {
					if (angular.isUndefined(filterObjects[id])) {
						$log.warn('tried to remove non-existing filter: ' + id);
						return;
					}

					let filterObject = filterObjects[id];
					if (filterObject.enabled) {
						let filterKey = filterObjects[id].toolbarItemId.replace('filter', '').toUpperCase();
						if (_.isFunction(self.setFilterIds) && id !== 'estimateMainLineItemStructureController') {
							self.setFilterIds(filterKey, []);
						}
					}

					if(id === 'costGroupStructureController' || id=== 'estimateAssembliesCostGroupStructureController' || id=== 'qtoCostGroupCatalogController'){
						// get the createCostGroupsStructureMainDataServiceFactory
						let serviceName  = filterObject.filterService.getServiceName();
						if( serviceName!== ''){
							let costGroupStructureService  = $injector.get(serviceName);
							costGroupStructureService.getService().removeFitlerIcon.fire('');
						}
					}else if(id === 'estimateMainWicBoqListController'){
						if(filterObject.filterService.clearWicGroupFilterIcon){
							filterObject.filterService.clearWicGroupFilterIcon.fire();
						}
					}else if(id==='estimateMainPriceAdjustmentController'){
						if(_.isFunction(filterObject.filterService.updateFilterTotalData)) {
							filterObject.filterService.updateFilterTotalData();
						}
					}

					_.remove(toolbarItems, {id: filterObjects[id].toolbarItemId});
					delete filterObjects[id];
					forceRootScopeApply();

					self.update();
				};

				self.removeAllFilters = function () {
					_.each(_.keys(filterObjects), function (id) {
						let filterObject = filterObjects[id];
						if (filterObject.enabled) {
							let filterKey = filterObjects[id].toolbarItemId.replace('filter', '').toUpperCase();
							if (_.isFunction(self.setFilterIds)) {
								self.setFilterIds(filterKey, []);
							}
						}
						if (angular.isObject(filterObject.filterService)) {
							_.each(filterObject.filterService.getList(), function (item) {
								item.IsMarked = false;
							});
						}

						if(_.isFunction(filterObject.filterService.clearFilterData)){
							filterObject.filterService.clearFilterData();
						}

						_.remove(toolbarItems, {id: filterObjects[id].toolbarItemId});
						delete filterObjects[id];
					});

					self.onFilterButtonRemoved.fire();

					forceRootScopeApply();

					self.update();
				};

				self.isFilter = function (id) {
					return !_.isUndefined(filterObjects[id]);
				};

				self.enableFilter = function (id) {
					if (angular.isObject(filterObjects[id])) {
						filterObjects[id].enabled = true;
					}

					self.update();
				};

				self.disableFilter = function (id) {
					if (angular.isObject(filterObjects[id])) {
						filterObjects[id].enabled = false;
					}
				};

				self.areFiltersAvailable = function () {
					return _.size(filterObjects) > 0;
				};

				self.getFilterObjects = function () {
					return filterObjects;
				};

				self.getFilterFunctionType = function () {
					return self.filterFunctionType;
				};

				self.setFilterFunctionType = function (type) {
					self.filterFunctionType = type;
					let dataService = self.getServiceToBeFiltered();
					if (dataService && _.isFunction(dataService.load)) {
						dataService.load();
					}
				};

				self.setFilterFunction = function (filterFunc) {
					let doUpdate = filterFunc !== filterFunction;
					filterFunction = filterFunc;
					if (doUpdate && self.areFiltersAvailable()) {
						self.update();
					}
				};

				// Show only the assigned line items of the current selection
				self.getCombinedFilterFunction = function () {
					return function (item) {
						let result = true;
						_.each(filterObjects, function (filterObj) {
							if (filterObj.enabled) {
								result = result && filterObj.predicate(item);
							}
						});
						return result;
					};
				};

				// Show the assigned and the line items without assignment
				self.getFilterFunctionAssignedAndWithoutAssignment = function () {
					return function (item) {
						return self.getCombinedFilterFunction()(item) || self.getFilterFunctionWithoutAssignment()(item);
					};
				};

				// Show only line items without assignment
				self.getFilterFunctionWithoutAssignment = function () {
					return function (item) {
						let result = true;
						_.each(filterObjects, function (filterObj) {
							if (filterObj.enabled) {
								if(filterObj.toolbarItemId && filterObj.toolbarItemId === 'EST_CONFIDENCE_CHECK'){
									result = result && filterObj.predicate(item);
								} else{
									result = result && item[filterObj.propertyName] === null;
								}
							}
						});
						return result;
					};
				};

				self.update = function () {
					if (serviceToBeFiltered !== null && filterFunction !== null && _.isFunction(filterFunction)) {
						serviceToBeFiltered.setItemFilter(filterFunction());
						serviceToBeFiltered.enableItemFilter();
					}
					self.onUpdated.fire();
				};

				self.getServiceToBeFiltered = function () {
					return serviceToBeFiltered;
				};

				self.setServiceToBeFiltered = function (dataService) {
					if (!isValidDataService(dataService)) {
						return;
					}

					serviceToBeFiltered = dataService;
				};

				self.getToolbar = function () {
					self.tools = {
						showImages: true,
						showTitles: true,
						cssClass: 'tools',
						items: [
							{
								caption: 'radio group caption',
								type: 'sublist',
								iconClass: 'filterCollection',
								list: {
									cssClass: 'radio-group',
									showTitles: true,
									items: toolbarItems
								}
							},
							{
								caption: 'radio group caption',
								type: 'sublist',
								iconClass: 'filterBoQ',
								list: {
									cssClass: 'radio-group',
									activeValue: 'Combined',
									showTitles: true,
									items: [
										{
											id: 'filterBoQ',
											caption: moduleName + '.' + subModuleName + '.filterAssigned',
											type: 'radio',
											value: 'Combined',
											iconClass: 'tlb-icons ico-filter-assigned',
											fn: function () {
												self.setFilterFunctionType(0);
												self.setFilterFunction(self.getCombinedFilterFunction);
											},
											disabled: function () {
												return !self.areFiltersAvailable();
											}
										},
										{
											id: 'filterBoQAndNotAssigned',
											caption: moduleName + '.' + subModuleName + '.filterAssignedAndNotAssigned',
											type: 'radio',
											value: 'AssignedAndWithoutAssignment',
											iconClass: 'tlb-icons ico-filter-assigned-and-notassigned',
											fn: function () {
												self.setFilterFunctionType(1);
												self.setFilterFunction(self.getFilterFunctionAssignedAndWithoutAssignment);
											},
											disabled: function () {
												return !self.areFiltersAvailable();
											}
										},
										{
											id: 'filterNotAssigned',
											caption: moduleName + '.' + subModuleName + '.filterNotAssigned',
											type: 'radio',
											value: 'WithoutAssignment',
											iconClass: 'tlb-icons ico-filter-notassigned',
											fn: function () {
												self.setFilterFunctionType(2);
												self.setFilterFunction(self.getFilterFunctionWithoutAssignment);
											},
											disabled: function () {
												return !self.areFiltersAvailable();
											}
										}
									]
								}
							}
						]
					};
					return self.tools;
				};

			};

			// service API
			return {
				getInstance: function (moduleName, subModuleName) {
					return new FilterServiceProvider(moduleName, subModuleName);
				}
			};

		}]);
})();
