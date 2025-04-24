/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/*global angular, Platform */

	/**
	 * @ngdoc service
	 * @name modelCommonFilterServiceProvider
	 * @function
	 *
	 * @description
	 * modelCommonFilterServiceProvider for filtering e.g. line items container by combination of several filters.
	 */
	angular.module('model.main').factory('modelCommonFilterServiceProvider', ['_', '$log', 'platformGridAPI',
		'$rootScope',
		function (_, $log, platformGridAPI, $rootScope) {

			var FilterServiceProvider = function (subModuleName) {
				var self = this,
					filterObjects = {},
					serviceToBeFiltered = null,
					filterFunction = null,
					toolbarItems = [];

				self.onUpdated = new Platform.Messenger();
				self.onFilterButtonRemoved = new Platform.Messenger();

				self.addFilter = function (id, gridIdOrService, predicate, toolbarItem, propertyName) {
					filterObjects[id] = {
						predicate: predicate,
						enabled: true,
						toolbarItemId: toolbarItem.id,
						propertyName: propertyName
					};

					toolbarItem.caption = 'model.' + subModuleName + '.' + toolbarItem.id;
					toolbarItem.type = 'radio';
					toolbarItem.value = toolbarItem.id;
					toolbarItem.fn = function deselect() {
						if (angular.isString(gridIdOrService)) {
							platformGridAPI.rows.selection({rows: [], gridId: gridIdOrService});
						} else if (angular.isObject(gridIdOrService)) {
							_.each(gridIdOrService.getList(), function (item) {
								item.IsMarked = false;
							});

							filterObjects[id].enabled = false;
							gridIdOrService.markersChanged([]); // remove filter
							gridIdOrService.gridRefresh();
						}
					};

					_.remove(toolbarItems, {id: filterObjects[id].toolbarItemId});
					toolbarItems.push(toolbarItem);
					if ($rootScope.$root.$$phase !== '$apply' && $rootScope.$root.$$phase !== '$digest') {
						$rootScope.$apply();
					}

					self.update();
				};

				self.removeFilter = function (id) {
					if (angular.isUndefined(filterObjects[id])) {
						$log.warn('tried to remove non-existing filter: ' + id);
						return;
					}

					var filterObject = filterObjects[id];
					if (filterObject.enabled){
						var filterKey = filterObjects[id].toolbarItemId.replace('filter','').toUpperCase();
						if (_.isFunction(self.setFilterIds)) {
							self.setFilterIds(filterKey, []);
						}
					}

					_.remove(toolbarItems, {id: filterObjects[id].toolbarItemId});
					delete filterObjects[id];

					self.onFilterButtonRemoved.fire();

					if ($rootScope.$root.$$phase !== '$apply' && $rootScope.$root.$$phase !== '$digest') {
						$rootScope.$apply();
					}

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

				self.setFilterFunction = function (filterFunc) {
					var doUpdate = filterFunc !== filterFunction;
					filterFunction = filterFunc;
					if (doUpdate && self.areFiltersAvailable()) {
						self.update();
					}
				};

				// Show only the assigned line items of the current selection
				self.getCombinedFilterFunction = function () {
					return function (item) {
						var result = true;
						_.each(filterObjects, function (filterObj) {
							if (filterObj.enabled) {
								result = result && filterObj.predicate(item);
							}
						});
						return result;
					};
				};

				self.update = function () {
					if (serviceToBeFiltered !== null && filterFunction !== null && _.isFunction(filterFunction)) {
						serviceToBeFiltered.setItemFilter(filterFunction());
						serviceToBeFiltered.enableItemFilter();
						if (_.isFunction(serviceToBeFiltered.isDataLoaded) && _.isFunction(serviceToBeFiltered.load)) {
							if (!serviceToBeFiltered.isDataLoaded()) {
								serviceToBeFiltered.load();
							}
						}
					}
					self.onUpdated.fire();
				};

				self.getServiceToBeFiltered = function () {
					return serviceToBeFiltered;
				};

				self.setServiceToBeFiltered = function (dataServiceObj) {
					if (dataServiceObj !== null) {
						serviceToBeFiltered = dataServiceObj;
					}
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
							}
						]
					};

					return self.tools;
				};

			};

			// service API
			return {
				getInstance: function (subModuleName) {
					return new FilterServiceProvider(subModuleName);
				}
			};

		}]);
})(angular);
