/**
 * Created by waz on 11/9/2017.
 */
(function (angular) {
	'use strict';

	const module = 'basics.common';
	angular
		.module(module)
		.factory('basicsCommonContainerDialogSingleGridContainerHandler', BasicsCommonContainerDialogSingleGridContainerHandler);
	BasicsCommonContainerDialogSingleGridContainerHandler.$inject = ['$injector', 'platformGridAPI', '_'];

	function BasicsCommonContainerDialogSingleGridContainerHandler($injector, platformGridAPI, _) {

		const service = {
			setConfig: setConfig,
			refresh: refresh,
			close: close,
			ok: ok,
			search: search
		};
		let containerDataService;
		let containerGridId;
		let mainDataService;
		let currentDataService;
		let foreignKey;
		let parentItemForeignKey;
		let onOkStart;
		let onOkFinish;
		let serviceContainer;

		function setConfig(dialogOption) {
			if (!dialogOption.custom) {
				return;
			}

			containerDataService = getService(dialogOption.custom.container.dataService);
			containerGridId = dialogOption.custom.container.gridId;
			mainDataService = getService(dialogOption.mainDataService);
			currentDataService = getService(dialogOption.custom.currentDataService);
			foreignKey = dialogOption.custom.foreignKey;
			parentItemForeignKey = dialogOption.custom.parentItemForeignKey ? dialogOption.custom.parentItemForeignKey : 'Id';
			onOkStart = dialogOption.custom.onOkStart;
			onOkFinish = dialogOption.custom.onOkFinish;
			serviceContainer = dialogOption.serviceContainer;
		}

		function refresh(onLoadfinish) {
			containerDataService.deselect();
			containerDataService.load().then(function () {
				if (onLoadfinish) {
					onLoadfinish();
				}
			});
		}

		function close() {
			containerDataService.killRunningLoad();
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
			const hasSetContainerCorrect = serviceContainer && serviceContainer.data && serviceContainer.data.onCreateSucceeded;
			const value = mainDataService.parentService().getSelected()[parentItemForeignKey];
			_.each(needAddItems, function (item) {
				item[foreignKey] = value;
			});

			// Beacuse of histroy issue, I need to compat the rest of two conditions
			if (mainDataService.assignItems && currentDataService.assignItems) {
				mainDataService.assignItems(needAddItems, parentItemForeignKey, value, currentDataService);
			} else if (hasSetContainerCorrect) {
				// history issue
				_.each(needAddItems, function (item) {
					serviceContainer.data.onCreateSucceeded(item, serviceContainer.data);
				});
			} else {
				// history issue, a problem will caused when you switch parent item of currentDataService
				setList(currentDataService, _.concat(currentDataService.getList().concat(needAddItems)));
				currentDataService.markEntitiesAsModified(needAddItems);
			}
		}

		function search(filterString) {
			if (_.isEmpty(mainDataService.getList())) {
				refresh(function () {
					platformGridAPI.filters.updateFilter(containerGridId, filterString);
				});
			} else {
				platformGridAPI.filters.updateFilter(containerGridId, filterString);
			}
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