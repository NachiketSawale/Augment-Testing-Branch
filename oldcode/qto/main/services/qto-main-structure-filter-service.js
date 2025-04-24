(function (angular) {
	'use strict';

	var moduleName='qto.main';
	angular.module(moduleName).factory('qtoMainStrucutrueFilterService', ['_', '$log', 'PlatformMessenger', 'cloudDesktopSidebarService','qtoMainDetailService','qtoMainHeaderDataService',
		function (_, $log, PlatformMessenger, cloudDesktopSidebarService,qtoMainDetailService,qtoMainHeaderDataService) {

			var service = {
				addMarkersChanged: addMarkersChanged,
				isFilter: isFilter,
				removeFilter: removeFilter,
				getToolbar: getToolbar,
				getFilters: getFilters,
				onFilterMarksChanged: new PlatformMessenger(),
				onFilterButtonRemoved: new PlatformMessenger()
			};
			var filters = {method: 'Assigned'};
			var toolbarItems = [];


			function isFilter(filterId) {
				return filterId in filters;
			}

			function getFilters() {
				return filters;
			}

			function removeFilter(filterId) {
				var toolbarItem = _.find(toolbarItems, {itemName: filterId});
				if (toolbarItem && toolbarItem.fn) {
					toolbarItem.fn();
				}
			}

			function addMarkersChanged(dataService, treePresOpt, toolbarItem,filterPropertyFunc) {
				var itemName = dataService.getItemName();

				toolbarItem.itemName = dataService.getItemName();
				toolbarItem.caption = 'estimate.main' + '.' + toolbarItem.id;
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
					var allIds = [];
					var isFilter = false;
					if (_.isArray(itemList) && _.size(itemList) > 0) {
						isFilter = true;
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
						isFilter = false;
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

					if(angular.isString(filterPropertyFunc)){
						qtoMainDetailService[filterPropertyFunc](allIds);
					}else{
						// set filter keys and call update.
						qtoMainDetailService.setFilterPageNumbers(allIds);
					}

					var promise = qtoMainHeaderDataService.update();
					if(promise){
						promise.then(function(){
							qtoMainDetailService.load();// reload items in qto detail
						});
					}else{
						qtoMainDetailService.load();// reload items in qto detail
					}

					service.onFilterMarksChanged.fire(isFilter);
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
										caption: 'constructionsystem.main.filterAssigned',
										type: 'radio',
										value: 'Combined',
										iconClass: 'tlb-icons ico-filter-assigned',
										fn: function () {
											filters.method = 'Assigned';
											cloudDesktopSidebarService.filterStartSearch();
										},
										disabled: function () {
											return !toolbarItems.length;
										}
									},
									{
										id: 'filterBoQAndNotAssigned',
										caption: 'constructionsystem.main.filterAssignedAndNotAssigned',
										type: 'radio',
										value: 'AssignedAndWithoutAssignment',
										iconClass: 'tlb-icons ico-filter-assigned-and-notassigned',
										fn: function () {
											filters.method = 'AssignedAndNotAssigned';
											cloudDesktopSidebarService.filterStartSearch();
										},
										disabled: function () {
											return !toolbarItems.length;
										}
									},
									{
										id: 'filterNotAssigned',
										caption: 'constructionsystem.main.filterNotAssigned',
										type: 'radio',
										value: 'WithoutAssignment',
										iconClass: 'tlb-icons ico-filter-notassigned',
										fn: function () {
											filters.method = 'NotAssigned';
											cloudDesktopSidebarService.filterStartSearch();
										},
										disabled: function () {
											return !toolbarItems.length;
										}
									}
								]
							}
						}
					]
				};
			}

			return service;
		}
	]);
})(angular);