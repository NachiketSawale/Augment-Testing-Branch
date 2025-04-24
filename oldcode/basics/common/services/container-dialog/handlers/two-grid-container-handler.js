/**
 * Created by waz on 11/1/2017.
 */
(function (angular) {
	'use strict';

	const module = 'basics.common';
	angular
		.module(module)
		.factory('basicsCommonContainerDialogTwoGridContainerHandler', BasicsCommonContainerDialogTwoGridContainerHandler);
	BasicsCommonContainerDialogTwoGridContainerHandler.$inject = ['$injector', 'platformGridAPI', '_'];

	function BasicsCommonContainerDialogTwoGridContainerHandler($injector, platformGridAPI, _) {

		const service = {
			setConfig: setConfig,
			refresh: refresh,
			close: close,
			ok: ok,
			search: search,
			activeFilter: activeFilter
		};
		let dialogParentDataService;
		let dialogParentGridId;
		let dialogChildDataService;
		let currentDataService;
		let mainDataService;
		let foreignKey;
		let parentItemForeignKey;
		let onOkStart;
		let onOkFinish;

		let unfilterList;
		let filterFunc;
		let hasFilter;
		let isFilterActive;

		function setConfig(dialogOption) {
			if (!dialogOption.custom) {
				return;
			}

			dialogParentDataService = getService(dialogOption.custom.parentContainer.dataService);
			dialogParentGridId = dialogOption.custom.parentContainer.gridId;
			dialogChildDataService = getService(dialogOption.custom.childContainer.dataService);
			currentDataService = getService(dialogOption.custom.currentDataService);
			mainDataService = getService(dialogOption.mainDataService);
			foreignKey = dialogOption.custom.foreignKey;
			parentItemForeignKey = dialogOption.custom.parentItemForeignKey ? dialogOption.custom.parentItemForeignKey : 'Id';
			onOkStart = dialogOption.custom.onOkStart;
			onOkFinish = dialogOption.custom.onOkFinish;

			// clear child container data before dialog show,it's a tricky solution,if you have a better way,you can
			// tell we to replace it
			// --- walter zheng
			dialogChildDataService.getList().length = 0;

			hasFilter = !_.isNil(dialogOption.uiConfig.filterCheckbox);
			if (hasFilter) {
				unfilterList = mainDataService.getList();
				isFilterActive = false;
				filterFunc = dialogOption.uiConfig.filterCheckbox.filter ?
					dialogOption.uiConfig.filterCheckbox.filter :
					function (item) {
						return _.isNil(item[foreignKey]);
					};
				activeFilter(isFilterActive);
				mainDataService.gridRefresh();
			}
		}

		function refresh(onLoadfinish) {
			dialogParentDataService.deselect();
			dialogChildDataService.killRunningLoad();
			dialogParentDataService.load().then(function () {
				if (onLoadfinish) {
					onLoadfinish();
				}
				unfilterList = _.cloneDeep(mainDataService.getList());
				if (isFilterActive) {
					filter(filterFunc);
				}
			});
		}

		function close() {
			dialogParentDataService.killRunningLoad();
			dialogChildDataService.killRunningLoad();
		}

		function ok() {
			const selectedItems = mainDataService.getSelectedEntities();
			const needAddItems = getNeedAddItems(selectedItems);
			if (onOkStart) {
				onOkStart(selectedItems);
			}

			updateDataServiceList(needAddItems);
			if (onOkFinish) {
				onOkFinish(selectedItems);
			}
		}

		// use hashset to get items which isn't in list
		// complexity:O(m + n),m: list length,n: selectItems length
		function getNeedAddItems(selectedItems) {
			const hashset = {};
			_.forEach(currentDataService.getList(), function (item) {
				hashset[item.Id] = true;
			});
			const needAddItems = [];
			_.forEach(selectedItems, function (item) {
				if (!hashset[item.Id]) {
					needAddItems.push(item);
				}
			});
			return needAddItems;
		}

		function updateDataServiceList(needAddItems) {
			const value = mainDataService.parentService().getSelected()[parentItemForeignKey];
			_.each(needAddItems, function (item) {
				item[foreignKey] = value;
			});

			// tricky solution, beacuse when data service call setList method,it will mark item as modified
			const originList = _.cloneDeep(currentDataService.getList());
			setList(currentDataService, originList.concat(needAddItems));
			currentDataService.markEntitiesAsModified(needAddItems);
		}

		function search(filterString) {
			if (_.isEmpty(mainDataService.getList())) {
				refresh(function () {
					platformGridAPI.filters.updateFilter(dialogParentGridId, filterString);
					mainDataService.deselect();
					dialogChildDataService.getList().length = 0;
				});
			} else {
				platformGridAPI.filters.updateFilter(dialogParentGridId, filterString);
				mainDataService.deselect();
				dialogChildDataService.getList().length = 0;
			}

			if (isFilterActive) {
				filter(filterFunc);
			}
		}

		function activeFilter(isActived) {
			isFilterActive = isActived;
			return isFilterActive ? filter(filterFunc) : filter(null);
		}

		// data service set Filter can't pass a filter function,so I implement it manually
		function filter(filterFunc) {
			if (!hasFilter) {
				return;
			}

			// Attiention! service setList function will mark entity as modify! you need to override setList first!
			if (_.isNil(filterFunc)) {
				mainDataService.setList(unfilterList);
			} else {
				const filterList = _.filter(unfilterList, filterFunc);
				mainDataService.setList(filterList);
			}
			mainDataService.deselect();
			dialogChildDataService.getList().length = 0;
			dialogChildDataService.gridRefresh();
		}

		function setList(dataService, replaceList) {
			let list = dataService.getList();
			list.length = 0;
			list = _.forEach(replaceList, function (item) {
				list.push(item);
			});
			dataService.gridRefresh();
		}

		function getService(service) {
			return angular.isString(service) ? $injector.get(service) : service;
		}

		return service;
	}
})(angular);