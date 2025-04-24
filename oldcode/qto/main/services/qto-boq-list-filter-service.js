(function (angular) {
	/* global _ */
	'use strict';

	angular.module('qto.main').factory('qtoMainBoqFilterService', [
		'$log', 'PlatformMessenger', 'cloudDesktopSidebarService','qtoMainDetailService',
		function ($log, PlatformMessenger, cloudDesktopSidebarService,qtoMainDetailService) {

			let service = {
				addMarkersChanged: addMarkersChanged,
				isFilter: isFilter,
				removeFilter: removeFilter,
				getToolbar: getToolbar,
				getFilters: getFilters,
				onFilterMarksChanged: new PlatformMessenger(),
				onFilterButtonRemoved: new PlatformMessenger(),
				setFilterFlag :setFilterFlag,
				getFilterFlag :getFilterFlag
			};
			let filters = {method: 'Assigned'};
			let toolbarItems = [];
			let filterFlag = false;


			function isFilter(filterId) {
				return filterId in filters;
			}

			function getFilters() {
				return filters;
			}

			function removeFilter(filterId,isNoNeedLoad) {
				let toolbarItem = _.find(toolbarItems, {itemName: filterId});
				if (toolbarItem && toolbarItem.fn) {
					toolbarItem.fn(isNoNeedLoad);
				}
			}

			function  setFilterFlag(value){
				filterFlag = value;
			}

			function  getFilterFlag(){
				return filterFlag;
			}

			function addMarkersChanged(dataService, treePresOpt, toolbarItem, filterPropertyFunc) {
				let itemName = dataService.getItemName();

				toolbarItem.itemName = dataService.getItemName();
				toolbarItem.caption = 'qto.main' + '.' + toolbarItem.id;
				toolbarItem.type = 'radio';
				toolbarItem.value = toolbarItem.id;
				toolbarItem.fn = function deselect(isNoNeedLoad) {
					dataService.markersChanged([],null,isNoNeedLoad);
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

				dataService.markersChanged = function markersChanged(itemList, isFromLoad,isNoNeedLoad) {

					if(!isFromLoad) {
						service.setFilterFlag(true);
					}

					qtoMainDetailService.deleteTemporaryQtos();

					let isFilterLineItem = filterPropertyFunc === 'setFilterLineItems';

					let allIds = [];
					let estHeaderIds =  [];
					if (_.isArray(itemList) && _.size(itemList) > 0) {
						// get all child prj cost group (for each item)
						_.each(itemList, function (item) {
							let Ids = _.map(collectItems(item, treePresOpt && treePresOpt.childProp), 'Id');
							allIds = allIds.concat(Ids);

							if (isFilterLineItem) {
								estHeaderIds.push(item.EstHeaderFk);
							}
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
						dataService.gridRefresh();
						_.remove(toolbarItems, {id: toolbarItem.id});
						delete filters[itemName];

						// update leading structure container toolbar.
						service.onFilterButtonRemoved.fire();
					}

					if(isNoNeedLoad){
						return;
					}

					if(angular.isString(filterPropertyFunc)){
						if (isFilterLineItem) {
							qtoMainDetailService[filterPropertyFunc](allIds, estHeaderIds);
						} else {
							qtoMainDetailService[filterPropertyFunc](allIds);
						}
					}else{
						// set filter keys and call update.
						qtoMainDetailService.setFilterBoqs(allIds, itemList);
						let selectedItem = dataService.getSelected();
						if(selectedItem){
							qtoMainDetailService.setBoqLineType(selectedItem.BoqLineTypeFk);
						}
					}

					qtoMainDetailService.load().then(function(){
						service.setFilterFlag(false);
					});
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