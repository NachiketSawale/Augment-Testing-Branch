/**
 * Created by zwz on 12/5/2023.
 */

(function (angular) {
	'use strict';
	/* globals angular, _ */

	const moduleName = 'productionplanning.common';
	let module = angular.module(moduleName);

	/**
	 * @ngdoc factory
	 * @name ppsCommonHierarchyCollectionUtilService
	 * @description
	 * Provides method(s) for hierarchy collection
	 */
	module.service('ppsCommonHierarchyCollectionUtilService', HierarchyCollectionUtilService);

	HierarchyCollectionUtilService.$inject = [];

	function HierarchyCollectionUtilService() {
		let flatten = (parentItems, childProp) => {
			let items = parentItems;
			for (let parent of parentItems) {
				if (!_.isArray(parent[childProp]) || parent[childProp].length < 1) {
					continue;
				}
				items = items.concat(flatten(parent[childProp], childProp));
			}
			return items;
		};

		this.flatten = flatten;
	}

})(angular);

