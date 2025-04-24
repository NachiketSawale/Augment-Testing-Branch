/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/*global angular, _ */
	'use strict';

	/**
	 * @ngdoc service
	 * @name productionplanning.common:ppsCommonDataServiceItemFilterTreeExtension
	 * @function
	 * @requires
	 * @description
	 * ppsCommonDataServiceItemFilterTreeExtension adds owerwrites behaviour of platform-data-service-item-filter-extension (temporary solution!)
	 */
	angular.module('productionplanning.common').service('ppsCommonDataServiceItemFilterTreeExtension', PpsCommonDataServiceItemFilterTreeExtension);

	function PpsCommonDataServiceItemFilterTreeExtension() {
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

		// options can be passed additionally
		this.overwriteTreeFunction = function overwriteTreeFunction(container) {
			function getTreeOverwrite() {
				if (container.data.itemFilterEnabled) {
					return filterTree(container.data);
				}
				return container.data.itemTree;
			}
			container.service.getTree = getTreeOverwrite;
		};

		function filterList(data) {
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
		}

		function filterTree(data) {
			var filteredIds,
				removePredicate = function (node) {
					return filteredIds.indexOf(node.Id) >= 0;
				},

				filterTreeByIdsRecursive = function (node) {
					node[data.treePresOpt.childProp] = _.filter(node[data.treePresOpt.childProp], removePredicate);
					_.each(node[data.treePresOpt.childProp], filterTreeByIdsRecursive);
				};

			// first filter item list ...
			var filterItemList = filterList(data);

			// case: virtual nodes available (Id: -1)
			var virtualNodes = _.filter(data.itemList, function (item) {
				return item.Id === -1;
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

			var filteredItemTree = _.filter(data.itemTree, removePredicate);
			_.each(filteredItemTree, filterTreeByIdsRecursive);

			return filteredItemTree;
		}

		return self;
	}
})();