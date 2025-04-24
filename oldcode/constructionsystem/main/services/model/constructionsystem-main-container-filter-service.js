/**
 * Created by xsi on 2016-04-28.
 */
(function (angular) {
	'use strict';
	/* global _ */

	/**
	 * @ngdoc service
	 * @name constructionSystemMainFilterService
	 * @function
	 * @requires constructionSystemMainInstanceService
	 * @description
	 * #
	 * filter service of module constructionsystem main
	 */
	angular.module('constructionsystem.main').factory('constructionSystemMainContainerFilterService', [
		'$log', 'PlatformMessenger','cloudDesktopSidebarService','constructionSystemMainObjectService',
		function ($log, PlatformMessenger, cloudDesktopSidebarService,constructionSystemMainObjectService) {

			var service = {
				addMarkersChanged: addMarkersChanged,
				isFilter: isFilter,
				removeFilter: removeFilter,
				getToolbar: getToolbar,
				getFilters:getFilters,
				onFilterMarksChanged: new PlatformMessenger(),
				onFilterButtonRemoved: new PlatformMessenger()
			};
			var filters = {};
			var toolbarItems = [];


			function isFilter(filterId) {
				return filterId in filters;
			}

			function getFilters(){
				return filters;
			}

			function removeFilter(filterId) {
				var toolbarItem = _.find(toolbarItems, {itemName: filterId});
				if (toolbarItem && toolbarItem.fn) {
					toolbarItem.fn();
				}
			}

			function addMarkersChanged(dataService, treePresOpt, toolbarItem) {
				var itemName = 'Container';

				toolbarItem.itemName = itemName;
				toolbarItem.caption = 'constructionsystem.main.filterContainer';
				toolbarItem.type = 'radio';
				toolbarItem.value = toolbarItem.id;
				toolbarItem.fn = function deselect() {
					dataService.markersChanged([]);
				};

				dataService.getGridConfig = function () {
					return angular.extend({
						childSort: true,
						marker: {
							filterService: service,
							filterId: itemName,
							dataService: dataService,
							serviceName: dataService.getServiceName()
						}
					}, treePresOpt);
				};

				dataService.markersChanged = function markersChanged(itemList) {
					if (_.isArray(itemList) && _.size(itemList) > 0) {
						var allIds = [];

						// get all child prj cost group (for each item)
						_.each(itemList, function (item) {
							var Ids = _.map(collectItems(item, treePresOpt && treePresOpt.childProp), 'Id');
							allIds = allIds.concat(Ids);
						});
						filters[itemName] = allIds;

						if (!_.some(toolbarItems, {id: toolbarItem.id})) {
							toolbarItems.push(toolbarItem);
						}
					} else {
						if (angular.isUndefined(filters[itemName])) {
							$log.warn('tried to remove non-existing filter: ' + itemName);
							return;
						}

						_.each(dataService.getList(), function (item) {
							item.IsMarked = false;
						});
						_.remove(toolbarItems, {id: toolbarItem.id});
						delete filters[itemName];

						// update leading structure container toolbar.
						service.onFilterButtonRemoved.fire();
					}

					constructionSystemMainObjectService.loadDataByContainerFilter(filters[itemName]);
					dataService.gridRefresh();

					// update instance list container toolbar
					service.onFilterMarksChanged.fire();

				};

				function collectItems(item, childProp, resultArr) {
					resultArr = resultArr || [];
					resultArr.push(item);
					_.each(item[childProp], function (item) {
						collectItems(item, childProp, resultArr);
					});
					return resultArr;
				}

				return dataService;
			}

			function getToolbar() {
				return {
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
			}

			return service;
		}
	]);
})(angular);




