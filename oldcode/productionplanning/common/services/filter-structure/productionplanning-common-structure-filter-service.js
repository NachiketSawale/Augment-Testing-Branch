/**
 * Created by las on 2/1/2018.
 */


(function () {
	'use strict';
	/*global angular, Platform*/

	angular.module('productionplanning.common').factory('productionplanningCommonStructureFilterService', ['$injector', '$log', '$rootScope',
		function ($injector, $log, $rootScope) {
			var filterService = {};

			// support for server side filtering
			var structure4MainService = {}, filterRequest = {};
			//var mainServiceName;

			filterService.setFilterIds = function (mainServiceName, key, ids, loadData) {
				loadData = _.isUndefined(loadData) ? true : loadData;

				var structure2FilterIds = structure4MainService[mainServiceName];
				if (!structure2FilterIds) {
					structure2FilterIds = {};
				}
				structure2FilterIds[key] = ids;
				structure4MainService[mainServiceName] = structure2FilterIds;

				var dataService = $injector.get(mainServiceName);
				if (dataService && _.isFunction(dataService.load) && loadData) {
					dataService.load();
				}
			};

			filterService.getAllFilterIds = function (mainServiceName) {
				return structure4MainService[mainServiceName];
			};

			// activate support for filtering the leading structure on given property
			filterService.addLeadingStructureFilterSupport = function (mainServiceName, leadingStructreDataService, propertyName) {

				var mainDataService = $injector.get(mainServiceName);
				if (mainDataService && _.isFunction(mainDataService.getList)) {
					leadingStructreDataService.setItemFilter(function (item) {
						var ids = _.uniq(_.compact(_.map(mainDataService.getList(), propertyName)));
						return ids.indexOf(item.Id) >= 0;
					});
				}
			};

			filterService.getFilterRequest = function (mainServiceName) {
				return filterRequest[mainServiceName];
			};

			filterService.setFilterRequest = function (mainServiceName, _filterRequest) {
				filterRequest[mainServiceName] = _filterRequest;
			};

			filterService.collectItems = function (item, childProp, resultArr) {
				resultArr = resultArr || [];
				resultArr.push(item);
				_.each(item[childProp], function (item) {
					filterService.collectItems(item, childProp, resultArr);
				});
				return resultArr;
			};

			// filterObjects = {},
				 var filterObjects2Service = [],
				// serviceToBeFiltered = null,
				filterFunction = {},
					 toolbarItems2Service = [],
				//toolbarItems = [],
				filterFunctionType = {}; // 0: Assigned, 1: assigendAndNotAssigned, 2: notAssigned

			//var activeValue = 'Combined';

			filterService.onUpdated = new Platform.Messenger();
			filterService.onFilterButtonRemoved = new Platform.Messenger();

			filterService.forceRootScopeApply = function () {
				if ($rootScope.$root.$$phase !== '$apply' && $rootScope.$root.$$phase !== '$digest') {
					$rootScope.$apply();
				}
			};

			filterService.getFilterObjects = function getFilterObjects(mainServiceName) {
				var filterObjects = filterObjects2Service[mainServiceName];
				if(filterObjects === null || filterObjects === undefined)
				{
					filterObjects = {};
				}
				return filterObjects;
			};

			filterService.GetToolbarItems = function GetToolbarItems(mainServiceName) {
				var toolbarItems = toolbarItems2Service[mainServiceName];
				if(toolbarItems === null || toolbarItems === undefined)
				{
					toolbarItems = [];
					toolbarItems2Service[mainServiceName] = toolbarItems;
				}
				return toolbarItems;
			};

			filterService.getMainServiceName = function getMainServiceName(id) {
				// id = mainServiceName_ + custom leading-structure id, must be unique

				var array = id.split('_');
				if(!_.isArray(array) ){
					return;
				}
				return array[0];

			};
			filterService.addFilter = function (id, dataService, predicate, toolbarItem, propertyName) {

			   var serviceName = filterService.getMainServiceName(id);

				var filterObjects = filterService.getFilterObjects(serviceName);

				filterObjects[id] = {
					predicate: predicate,
					enabled: true,
					toolbarItemId: toolbarItem.id,
					propertyName: propertyName,
					filterService: dataService
				};

				toolbarItem.caption = 'productionplanning.common.' + (toolbarItem.captionId || toolbarItem.id);
				toolbarItem.type = 'item';
				toolbarItem.value = toolbarItem.id;
				toolbarItem.fn = function deselect() {
					_.each(dataService.getList(), function (item) {
						item.IsMarked = false;
					});

					filterObjects[id].enabled = false;
					dataService.markersChanged([]); // remove filter
					dataService.gridRefresh();
				};

				filterObjects2Service[serviceName] = filterObjects;
			    var toolbarItems = filterService.GetToolbarItems(serviceName);
				_.remove(toolbarItems, {id: filterObjects[id].toolbarItemId});
				toolbarItems.push(toolbarItem);
				toolbarItems2Service[serviceName] = toolbarItems;

				filterService.forceRootScopeApply();

				filterService.update(serviceName);
			};

			//remove filer process:
			//1.remove markers(filterId)
			//2.removeFilter
			//3.markersChangered, fre
			filterService.removeFilter = function (id) {
				var serviceName = filterService.getMainServiceName(id);
				var filterObjects = filterService.getFilterObjects(serviceName);
				if (angular.isUndefined(filterObjects[id])) {
					$log.warn('tried to remove non-existing filter: ' + id);
					return;
				}

				var filterObject = filterObjects[id];
				if (filterObject.enabled) {
					var filterKey = filterObjects[id].toolbarItemId.replace('filter', '').toUpperCase();
					if (_.isFunction(filterService.setFilterIds)) {
						filterService.setFilterIds(serviceName, filterKey, []);
					}
				}

				// _.each(filterObject.filterService.getList(), function (item) {
				// 	item.IsMarked = false;
				// });
				var toolbarItems = filterService.GetToolbarItems(serviceName);
				_.remove(toolbarItems, {id: filterObjects[id].toolbarItemId});
				delete filterObjects[id];

				//self.onFilterButtonRemoved.fire();

				filterService.forceRootScopeApply();

				filterService.update(serviceName);
			};

			filterService.removeAllFilters = function () {
				var filterObjects = filterService.getFilterObjects();
				_.each(_.keys(filterObjects), function (id) {
					var filterObject = filterObjects[id];
					if (filterObject.enabled) {
						var filterKey = filterObjects[id].toolbarItemId.replace('filter', '').toUpperCase();
						if (_.isFunction(filterService.setFilterIds)) {
							filterService.setFilterIds(filterKey, []);
						}
					}
					if (angular.isObject(filterObject.filterService)) {
						_.each(filterObject.filterService.getList(), function (item) {
							item.IsMarked = false;
						});
					}

					var toolbarItems = filterService.GetToolbarItems();
					_.remove(toolbarItems, {id: filterObjects[id].toolbarItemId});
					delete filterObjects[id];
				});

				filterService.onFilterButtonRemoved.fire();

				filterService.forceRootScopeApply();

				filterService.update();
			};

			filterService.isFilter = function (id) {
				var serviceName = filterService.getMainServiceName(id);
				var filterObjects = filterService.getFilterObjects(serviceName);
				return !_.isUndefined(filterObjects[id]);
			};

			filterService.enableFilter = function (id) {
				var serviceName = filterService.getMainServiceName(id);
				var filterObjects = filterService.getFilterObjects(serviceName);
				if (angular.isObject(filterObjects[id])) {
					filterObjects[id].enabled = true;
				}

				filterService.update(serviceName);
			};

			filterService.disableFilter = function (id) {
				var serviceName = filterService.getMainServiceName(id);
				var filterObjects = filterService.getFilterObjects(serviceName);
				if (angular.isObject(filterObjects[id])) {
					filterObjects[id].enabled = false;
				}
			};

			filterService.areFiltersAvailable = function (serviceName) {
				var filterObjects = filterService.getFilterObjects(serviceName);
				return _.size(filterObjects) > 0;
			};

			filterService.getFilterFunctionType = function (serviceName) {
				var type = filterFunctionType[serviceName];
				if(type === undefined)
				{
					return 0;
				}
				return type;
			};

			filterService.setFilterFunctionType = function (serviceName,type) {
				filterFunctionType[serviceName] = type;
				var dataService = $injector.get(serviceName);
				if (dataService && _.isFunction(dataService.load)) {
					dataService.load();
				}
			};

			filterService.setFilterFunction = function (serviceName, filterFunc) {
				var doUpdate = filterFunc !== filterFunction[serviceName];
				filterFunction[serviceName] = filterFunc;
				if (doUpdate && filterService.areFiltersAvailable(serviceName)) {
					filterService.update(serviceName);
				}
			};

			// Show only the assigned line items of the current selection
			filterService.getCombinedFilterFunction = function (serviceName) {
				return function (item) {
					var result = true;
					var filterObjects = filterService.getFilterObjects(serviceName);
					_.each(filterObjects, function (filterObj) {
						if (filterObj.enabled) {
							result = result && filterObj.predicate(item);
						}
					});
					return result;
				};
			};

			// Show the assigned and the line items without assignment
			filterService.getFilterFunctionAssignedAndWithoutAssignment = function (serviceName) {
				return function (item) {
					return filterService.getCombinedFilterFunction(serviceName)(item) || filterService.getFilterFunctionWithoutAssignment(serviceName)(item);
				};
			};

			// Show only line items without assignment
			filterService.getFilterFunctionWithoutAssignment = function () {
				return function () {
					//var result = true;
					/* removed the code because it is already done the filter at back-end*/
					// var filterObjects = filterService.getFilterObjects(serviceName);
					// _.each(filterObjects, function (filterObj) {
					// 	if (filterObj.enabled) {
					// 		result = result && (item[filterObj.propertyName] === null);
					// 	}
					// });
					return true;
				};
			};

			filterService.update = function (mainServiceName) {
				var serviceToBeFiltered = $injector.get(mainServiceName);
				var func = filterFunction[mainServiceName];
				if (serviceToBeFiltered !== null && func !== null && _.isFunction(func)) {
					serviceToBeFiltered.setItemFilter(func(mainServiceName));
					serviceToBeFiltered.enableItemFilter();
				}
				filterService.onUpdated.fire();
			};
			//
			// filterService.getServiceToBeFiltered = function () {
			// 	return serviceToBeFiltered;
			// };

			// filterService.setServiceToBeFiltered = function (dataService) {
			// 	serviceToBeFiltered = dataService;
			// };

			filterService.GetActiveValue = function(mainServiceName){
			   var filterType = filterService.getFilterFunctionType(mainServiceName);
				var activeValue = '';
				switch (filterType){
					case 0:
						activeValue = 'Combined';
						break;
					case 1:
						activeValue = 'AssignedAndWithoutAssignment';
						break;
					case 2:
						activeValue = 'WithoutAssignment';
						break;
					default:
						activeValue = 'Combined';
						break;
				}
				return activeValue;
			};

			filterService.getToolbar = function (mainService) {
				var mainServiceName = mainService.getServiceName();
				var toolbarItems = filterService.GetToolbarItems(mainServiceName);
				var activeValue = filterService.GetActiveValue(mainServiceName);
				filterService.tools = {
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
								activeValue: activeValue,
								showTitles: true,
								items: [
									{
										id: 'filterTask',
										caption: 'productionplanning.common.filterAssigned',
										type: 'radio',
										value: 'Combined',
										iconClass: 'tlb-icons ico-filter-assigned',
										fn: function () {
											filterService.setFilterFunctionType(mainServiceName, 0);
											filterService.setFilterFunction(mainServiceName, filterService.getCombinedFilterFunction);
										},
										disabled: function () {
											return !filterService.areFiltersAvailable(mainServiceName);
										}
									},
									{
										id: 'filterTaskAndNotAssigned',
										caption: 'productionplanning.common.filterAssignedAndNotAssigned',
										type: 'radio',
										value: 'AssignedAndWithoutAssignment',
										iconClass: 'tlb-icons ico-filter-assigned-and-notassigned',
										fn: function () {
											filterService.setFilterFunctionType(mainServiceName, 1);
											filterService.setFilterFunction(mainServiceName, filterService.getFilterFunctionAssignedAndWithoutAssignment);
										},
										disabled: function () {
											return !filterService.areFiltersAvailable(mainServiceName);
										}
									},
									{
										id: 'filterNotAssigned',
										caption: 'productionplanning.common.filterNotAssigned',
										type: 'radio',
										value: 'WithoutAssignment',
										iconClass: 'tlb-icons ico-filter-notassigned',
										fn: function () {
											filterService.setFilterFunctionType(mainServiceName, 2);
											filterService.setFilterFunction(mainServiceName, filterService.getFilterFunctionWithoutAssignment);
										},
										disabled: function () {
											return !filterService.areFiltersAvailable(mainServiceName);
										}
									}
								]
							}
						}
					]
				};
				return filterService.tools;
			};

			filterService.extendSearchFilterAssign = function(mainServiceName, filterRequest){
				// init furtherFilters - add filter IDs from filter structures
				var filterType = filterService.getFilterFunctionType(mainServiceName);

				// first remove all existing leading structure filters
				filterRequest.furtherFilters = _.filter(filterRequest.furtherFilters, function (i) {
					if(angular.isDefined(i.Token)) {
						return i.Token.indexOf('FILTER_BY_STRUCTURE') < 0;
					}
					else{
						return false;
					}
				});

				var leadingStructuresFilters = _.filter(_.map(filterService.getAllFilterIds(mainServiceName), function (v, k) {
					if (_.size(v) === 0) {
						return undefined;
					}

					var values = _.clone(v);

					// type 1 - assigned and not assigned
					if (filterType === 1) {
						values.push('null');
					}
					// type 2 - not assigned
					else if (filterType === 2) {
						values.push('unassign');
					}
					var value = values.join(',');
					return {Token: 'FILTER_BY_STRUCTURE:' + k, Value: value};
				}), angular.isDefined);

				filterRequest.furtherFilters = filterRequest.furtherFilters ? _.concat(filterRequest.furtherFilters, leadingStructuresFilters) : leadingStructuresFilters;
			};


			return filterService;
		}]);

})();