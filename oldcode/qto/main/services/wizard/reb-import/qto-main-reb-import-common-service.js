/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/* global globals, _ */

	let moduleName = 'qto.main';

	/**
	 * @ngdoc service
	 * @name qtoMainRebImportCommonService
	 * @description
	 */
	angular.module(moduleName).factory('qtoMainRebImportCommonService', ['salesCommonUtilsService',
		function (salesCommonUtilsService) {
			let service = {};

			function processPredecessors(items, childItem, strParentFk, processFunc) {
				let parentFk = childItem[strParentFk];
				let curParent = _.find(items, {Id: parentFk});

				while (curParent !== null && curParent !== undefined) {
					// do something
					processFunc(curParent);
					// go to next predecessor
					curParent = _.find(items, {Id: curParent[strParentFk]});
				}
			}

			service.onStructureMarkerChanged = function onStructureMarkerChanged(changedItem, allItems, strChildren, strParentFk) {

				// select all predecessor (parents)
				processPredecessors(allItems, changedItem, strParentFk,function (curParent) {
					if (changedItem.IsMarked) {
						curParent.IsMarked = true;
					} else {
						// only for boq items
						if (strParentFk === 'BoqItemFk') {
							let hasMarkedItem = _.find(curParent[strChildren], function (item) {
								return item.IsMarked;
							});

							if (!hasMarkedItem) {
								curParent.IsMarked = false;
							}
						}
					}
				});

				// on un-select/select, also un-select/select all successors
				if (_.isArray(changedItem[strChildren]) && _.size(changedItem[strChildren]) > 0) {
					var allChildren = salesCommonUtilsService.flatten(changedItem[strChildren], strChildren);
					if (changedItem['IsMarked']) {
						_.each(allChildren, salesCommonUtilsService.setMarker);
					} else {
						_.each(allChildren, salesCommonUtilsService.clearMarker);
					}
				}
			};

			return service;
		}
	]);
})(angular);