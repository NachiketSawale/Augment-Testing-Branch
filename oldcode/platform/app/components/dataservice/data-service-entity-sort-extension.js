/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name platform:platformDataServiceEntitySortExtension
	 * @function
	 * @description
	 * platformDataServiceEntitySortExtension sorts entities by a given field. It can sort even hierarchical data
	 */
	angular.module('platform').service('platformDataServiceEntitySortExtension', PlatformDataServiceEntitySortExtension);

	PlatformDataServiceEntitySortExtension.$inject = ['_', 'platformObjectHelper'];

	function PlatformDataServiceEntitySortExtension(_, platformObjectHelper) {
		/**
		 * @ngdoc function
		 * @name state
		 * @function
		 * @methodOf platform.platformDataServiceHeaderInformationExtension
		 * @description maintains the header information for the data services
		 * @param container {object} contains entire service and its data to be created
		 * @returns state
		 */

		var self = this;

		this.addEntitySorting = function addEntitySorting(container, options) {
			if (self.shallProvideSortTree(options)) {
				container.data.sortByTree = true;
				container.data.initialSorted = false;
				container.data.sortByColumn = function doSortHierarchicalDataByField(list) {
					self.sortHierarchicalDataByField(list, container.data);
				};
				container.service.setInitialSorted = function setInitialSorted() {
					container.data.initialSorted = true;
				};
				container.service.isInitialSorted = function isInitialSorted() {
					return container.data.initialSorted;
				};
			} else if (self.shallProvideSortList(options)) {
				container.data.initialSorted = false;
				container.data.sortByColumn = function doSortFlatDataByField(list) {
					self.sortFlatDataByField(list, container.data);
				};
				container.service.setInitialSorted = function setInitialSorted() {
					container.data.initialSorted = true;
				};
				container.service.isInitialSorted = function isInitialSorted() {
					return container.data.initialSorted;
				};
			} else {
				container.data.sortByColumn = function doNotSortBecauseSortingIsNotSpecified() {
				};
			}
		};

		this.shallProvideSortTree = function shallProvideSortTree(options) {
			return (options && options.presenter && options.presenter.tree && isSortingRequired(options.presenter.tree));
		};

		this.shallProvideSortList = function shallProvideSortList(options) {
			return (options && options.presenter && options.presenter.list && isSortingRequired(options.presenter.list));
		};

		this.sortHierarchicalDataByField = function sortHierarchicalDataByField(list, data) {
			var field = data.treePresOpt.sortOptions.initialSortColumn.field;
			var childProp = data.treePresOpt.childProp;
			var items;
			if (list) {
				items = list;
			} else {
				items = data.itemTree;
			}
			self.sortTree(items, field, childProp, data);
			data.orderCreatedItems(items);
		};

		self.sortFlatDataByField = function sortFlatDataByField(list, data) {
			var field = data.listPresOpt.sortOptions.initialSortColumn.field;
			var items;
			if (list) {
				items = list;
			} else {
				items = data.itemList;
			}

			self.sortList(items, field, data);
		};

		/* jshint -W074 */ // For me there is no cyclomatic complexity
		self.sortList = function sortList(items, field, data) {
			items.sort(function (a, b) {
				var valueA = platformObjectHelper.getValue(a, field);
				var valueB = platformObjectHelper.getValue(b, field);

				if (valueA === null || valueA === '') {
					return 1;
				}
				if (valueB === null || valueB === '') {
					return -1;
				}
				var a1 = ('' + valueA).toLowerCase();
				var b1 = ('' + valueB).toLowerCase();

				// Special case: if both values are integers do a integer comparison instead of a string comparison.
				var doNumericComparison = canDoNumericComparison(data);
				if (angular.isDefined(doNumericComparison) && doNumericComparison !== null && doNumericComparison) {

					// First check if the values are valid positive integers
					var aIsValidInt = /^\d+$/.test(valueA);
					var bIsValidInt = /^\d+$/.test(valueB);

					if (aIsValidInt && !bIsValidInt) {
						return -1; // Only first value is valid integer
					} else if (!aIsValidInt && bIsValidInt) {
						return 1;  // Only second value is valid integer
					} else if (aIsValidInt && bIsValidInt) {
						// Both values are valid integers -> do numeric comparison
						a1 = parseInt(valueA, 10);
						b1 = parseInt(valueB, 10);
					}
				}

				if (a1 < b1) {
					return -1;
				}
				if (a1 > b1) {
					return 1;
				}
				return 0;
			});
		};

		self.sortTree = function sortTree(items, field, childProp, data) {
			self.sortList(items, field, data);
			_.forEach(items, function (item) {
				if (item[childProp] && item[childProp].length > 0) {
					self.sortTree(item[childProp], field, childProp, data);
				}
			});
		};

		self.sortBranchOfTree = function sortBranchOfTree(items, data) {
			if (data && data.treePresOpt) {
				if (data.treePresOpt.sortOptions && data.treePresOpt.sortOptions.initialSortColumn && data.treePresOpt.sortOptions.initialSortColumn.field) {
					self.sortList(items, data.treePresOpt.sortOptions.initialSortColumn.field, data);
				} else if (data.treePresOpt.childSort) {
					if (_.isFunction(data.treePresOpt.childSort)) {
						items.sort(data.treePresOpt.childSort);
					} else {
						items.sort();
					}
				}
			}
		};

		function isSortingRequired(presOpt) {
			return (presOpt.sortOptions && presOpt.sortOptions.initialSortColumn && presOpt.sortOptions.initialSortColumn.field);
		}

		function canDoNumericComparison(data) {
			if (data) {
				if (data.sortByTree) {
					return data.treePresOpt && data.treePresOpt.sortOptions && data.treePresOpt.sortOptions.doNumericComparison;
				} else {
					return data.listPresOpt && data.listPresOpt.sortOptions && data.listPresOpt.sortOptions.doNumericComparison;
				}
			}

			return false;
		}
	}
})();