/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	/* global angular, _ */
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceItemFilterExtension
	 * @function
	 * @requires
	 * @description
	 * platformDataServiceItemFilterExtension adds data processor(s behaviour to data services created from the data service factory
	 */
	angular.module('platform').service('platformDataServiceItemFilterExtension', PlatformDataServiceItemFilterExtension);

	function PlatformDataServiceItemFilterExtension() {
		/**
		 * @ngdoc function
		 * @name addItemFilter
		 * @function
		 * @methodOf platform.PlatformDataServiceDataProcessorExtension
		 * @description adds data processor(s) to data services
		 * @param container {object} contains entire service and its data to be created
		 * @param options {object} contains options about item filter
		 * @returns
		 */
		var self = this;
		var filteredIds;

		// options can be passed additionally
		this.addItemFilter = function addItemFilter(container, options) {
			if (options.useItemFilter) {
				container.service.setItemFilter = function setItemFilter(predicate) {
					self.setItemFilter(predicate, container.data);
				};

				container.service.enableItemFilter = function enableItemFilter(enabled) {
					self.enableItemFilter(enabled, container.data);
				};

				container.service.isItemFilterEnabled = function isItemFilterEnabled() {
					return self.isItemFilterEnabled(container.data);
				};
			}
		};

		this.setItemFilter = function setItemFilter(predicate, data) {
			var doListReload = data.itemFilter !== predicate;
			data.itemFilter = predicate;
			if (predicate === null) {
				data.itemFilterEnabled = false;
			}
			if (doListReload) {
				data.listLoaded.fire();
			}
		};

		this.enableItemFilter = function enableItemFilter(enabled, data) {
			enabled = angular.isUndefined(enabled) ? true : enabled; // call func without param
			var doListReload = data.itemFilterEnabled !== enabled;
			data.itemFilterEnabled = enabled;
			if (doListReload) {
				data.listLoaded.fire();
			}
		};

		this.isItemFilterEnabled = function isItemFilterEnabled(data) {
			return data.itemFilterEnabled;
		};

		this.filterList = function filterList(data) {
			// extend filter to show also version 0 items
			// (e.g. new items should be visible despite filtering)
			if (typeof data.itemFilter === 'function') {
				return _.filter(data.itemList, function (item) {
					return data.itemFilter(item) || item.Version === 0;
				});
			} else if (typeof data.itemFilter === 'object') {
				return _.filter(data.itemList, angular.extend(data.itemFilter, {'Version': 0}));
			}

			return _.filter(data.itemList, data.itemFilter);
		};

		this.filterTree = function filterTree(data) {
			var removePredicate = function (node) {
					return filteredIds.indexOf(node.Id) < 0;
				},

				filterTreeByIdsRecursive = function (node) {
					_.remove(node[data.treePresOpt.childProp], removePredicate);
					_.each(node[data.treePresOpt.childProp], filterTreeByIdsRecursive);
				};

			// first filter item list ...
			var filterItemList = this.filterList(data);

			// case: virtual nodes available (Id: -1, or strings like 'schedule3')
			var virtualNodes = _.filter(data.itemList, function (item) {
				return item.Id === -1 || _.isString(item.Id);
			});

			// consider all antecessors ...
			var allAntecessors = [];
			_.each(filterItemList, function (node) {
				while (node) {
					var parentNodeId = node[data.treePresOpt.parentProp];
					if (parentNodeId && allAntecessors.indexOf(parentNodeId) < 0) {
						allAntecessors.push(parentNodeId);
					}
					node = _.find(data.itemList, {Id: parentNodeId});
				}
			});

			// and merge filterItemList and allAntecessors -> unique items
			filteredIds = _.union(_.map(filterItemList, 'Id'), allAntecessors, _.map(virtualNodes, 'Id'));

			// then create a filtered copy of item tree
			var filteredItemTree = angular.copy(data.itemTree);
			_.remove(filteredItemTree, removePredicate);
			_.each(filteredItemTree, filterTreeByIdsRecursive);

			return filteredItemTree;
		};
	}
})();
