(function (angular) {
	'use strict';

	let moduleName = 'procurement.package';

	angular.module(moduleName).factory('procurementPackageBoqScopeReplacementDialogService', procurementPackageBoqScopeReplacementDialogService);

	procurementPackageBoqScopeReplacementDialogService.$inject = [
		'globals',
		'platformDataServiceFactory',
		'$http', '$q',
		'_',
		'platformRuntimeDataService'];

	function procurementPackageBoqScopeReplacementDialogService(
		globals,
		platformDataServiceFactory,
		$http, $q,
		_,
		platformRuntimeDataService
	) {
		let serviceOption = {
			module: angular.module(moduleName),
			serviceName: 'procurementRfqPartialreqAssignedDataDirectiveDataService',
			httpRead: {
				route: globals.webApiBaseUrl + 'procurement/package/wizard/',
				endRead: 'getreplacementboqs',
				usePostForRead: false
			},
			presenter: {
				tree: {
					parentProp: 'BoqItemFk',
					childProp: 'BoQItems',
					incorporateDataRead: incorporateDataRead
				}
			},
			entitySelection: {},
			modification: {},
			actions: {
				delete: false,
				create: false
			}
		};
		let container = platformDataServiceFactory.createNewComplete(serviceOption);
		let service = container.service;
		let data = container.data;
		let boqLineTypes = [0, 203]; // boq position(0) and surcharge(203) can be checked --.200, 201, 202,
		let originalSelectedIds = [];
		let allAssignments = [];
		let boqItemsTreeNotInRootAssign = [];
		let localTargetBoqItem = null;
		let isLoaded = false;
		container.data.markItemAsModified = function () {
		};
		service.markItemAsModified = function () {
		};
		service.load = _.noop;
		service.loadData = loadData;
		service.loadBySelection = loadBySelection;
		service.getSelectedData = getSelectedData;
		service.getUnselectedData = getUnselectedData;
		service.canUpdate = canUpdate;
		service.reset = reset;
		service.updateItemAssignments = updateItemAssignments;
		service.updateBoqItems = updateBoqItems;
		service.hasError = hasError;

		return service;

		// ///////////
		function loadData(packageId, boqHeaderId) {
			// only load data once
			if (!isLoaded) {
				return $http.get(data.httpReadRoute + data.endRead + '?packageId=' + packageId + '&targetBoqHeaderId=' + boqHeaderId)
					.then(function (response) {
						let result = response?.data ?? null;
						if (result) {
							allAssignments = result.allItemAssignments || [];
							boqItemsTreeNotInRootAssign = result.boqItemsTreeNotInRootAssign || [];
						}
						isLoaded = true;
						return true;
					});
			} else {
				return $q.when(true);
			}
		}

		function loadBySelection(targetBoqItem, dontRecalculate) {
			dontRecalculate = dontRecalculate ?? false;
			// if there is no boq item selected, show empty list
			if (!targetBoqItem || boqLineTypes.indexOf(targetBoqItem.BoqLineTypeFk) === -1) {
				return data.onReadSucceeded(null, data);
			}
			localTargetBoqItem = targetBoqItem;
			originalSelectedIds = [];

			return data.onReadSucceeded({dontRecalculate}, data);
		}

		function incorporateDataRead(readData, data) {
			if (!readData) {
				return data.handleReadSucceeded([], data);
			}

			// get root item assignments of Current Boq selected
			let rootItemAssignsOfCurBoq = allAssignments.filter(e => !e.PrcItemAssignmentFk && e.BoqHeaderFk === localTargetBoqItem.BoqHeaderFk && e.BoqItemFk === localTargetBoqItem.Id);
			// get boq ids from child item assignments of Current Boq selected, such kind of boq items should be shown as selected
			originalSelectedIds = allAssignments.filter(e => e.BoqItemFk &&
				rootItemAssignsOfCurBoq.some(f => f.Id === e.PrcItemAssignmentFk))
				.map(e => e.BoqItemFk);
			originalSelectedIds = _.uniq(originalSelectedIds);
			// get boq ids from child item assignments of not Current Boq selected, such kind of boq items should not be shown
			let childAssignBoqIdsOfNotCurBoq = allAssignments.filter(e => e.PrcItemAssignmentFk && e.BoqItemFk &&
				!rootItemAssignsOfCurBoq.some(f => f.Id === e.PrcItemAssignmentFk))
				.map(e => e.BoqItemFk);
			childAssignBoqIdsOfNotCurBoq = _.uniq(childAssignBoqIdsOfNotCurBoq);

			// keep boqItemsTreeNotInRootAssign as original
			let boqItemsTemp = angular.copy(boqItemsTreeNotInRootAssign);
			initBoqItems(boqItemsTemp, {childAssignBoqIdsOfNotCurBoq: childAssignBoqIdsOfNotCurBoq, dontRecalculate: readData.dontRecalculate});
			return data.handleReadSucceeded(boqItemsTemp, data);
		}

		function getSelectedData() {
			let list = service.getList();
			return _.filter(list, function (item) {
				return item.isSelect;
			});
		}

		function getUnselectedData() {
			let list = service.getList();
			return _.filter(list, function (item) {
				return boqLineTypes.indexOf(item.BoqLineTypeFk) > -1 && !item.isSelect;
			});
		}

		function canUpdate() {
			let list = service.getList();
			let selectedIds = [];
			let hasError = false;
			_.forEach(list, function (item) {
				if (item.isSelect) {
					selectedIds.push(item.Id);
				}
				hasError |= platformRuntimeDataService.hasError(item, 'BudgetPercent');
				hasError |= platformRuntimeDataService.hasError(item, 'BudgetTotal');
			});

			let hasDifference = !_.isEqual(selectedIds, originalSelectedIds);
			return hasDifference && !hasError;
		}

		function hasError(item) {
			if (!item) {
				return false;
			}
			let hasError = false;
			hasError |= platformRuntimeDataService.hasError(item, 'BudgetPercent');
			hasError |= platformRuntimeDataService.hasError(item, 'BudgetTotal');
			return hasError;
		}

		function reset() {
			localTargetBoqItem = null;
			originalSelectedIds = [];
			allAssignments = [];
			boqItemsTreeNotInRootAssign = [];
			data.onReadSucceeded(null, data);
			isLoaded = false;
		}

		function updateItemAssignments(updateScopeResult) {
			if (!updateScopeResult) {
				return;
			}

			if (localTargetBoqItem) {
				if (_.isNumber(updateScopeResult.TargetBoqItemFinalPrice)) {
					localTargetBoqItem.Finalprice = updateScopeResult.TargetBoqItemFinalPrice;
				}
				if (_.isNumber(updateScopeResult.TargetBoqItemBudgetTotal)) {
					localTargetBoqItem.BudgetTotal = updateScopeResult.TargetBoqItemBudgetTotal;
				}
			}
			if (updateScopeResult.ItemAssignmentsToCreate && updateScopeResult.ItemAssignmentsToCreate.length > 0) {
				_.forEach(updateScopeResult.ItemAssignmentsToCreate, function (item) {
					allAssignments.push(item);
				});
			}
			if (updateScopeResult.ItemAssignmentsToDelete && updateScopeResult.ItemAssignmentsToDelete.length > 0) {
				_.forEach(updateScopeResult.ItemAssignmentsToDelete, function (item) {
					allAssignments = allAssignments.filter(e => e.Id !== item.Id);
				});
			}
		}

		function updateBoqItems() {
			const boqItems = service.getList();
			if (!boqItems || boqItems.length === 0) {
				return;
			}
			let flattenNotInRootAssign = [];
			let flattenBoqItems = [];
			data.flatten(boqItemsTreeNotInRootAssign, flattenNotInRootAssign, data.treePresOpt.childProp);
			data.flatten(boqItems, flattenBoqItems, data.treePresOpt.childProp);
			flattenNotInRootAssign = flattenNotInRootAssign.filter(e => boqLineTypes.indexOf(e.BoqLineTypeFk) > -1);
			flattenBoqItems = flattenBoqItems.filter(e => boqLineTypes.indexOf(e.BoqLineTypeFk) > -1);
			flattenNotInRootAssign.forEach((item) => {
				let boqItem = _.find(flattenBoqItems, {Id: item.Id});
				if (boqItem) {
					_.assign(item, boqItem);
				}
			});
		}

		function setItemSelection(item) {
			if (originalSelectedIds.indexOf(item.Id) > -1) {
				item.isSelect = true;
			} else {
				item.isSelect = item.isSelect ?? false;
			}
		}

		function setItemBudgetPercent(item, dontRecalculate) {
			if (!item) {
				return;
			}
			dontRecalculate = dontRecalculate ?? false;
			const isInOriginalSelected = originalSelectedIds.indexOf(item.Id) > -1;
			if (!dontRecalculate) {
				// only when load the data first time, the BudgetPercent is undefined, it should be calculated.
				if (!_.isNumber(item.BudgetPercent)) {
					if (item.isSelect && localTargetBoqItem.BudgetTotal !== 0) {
						item.BudgetPercent = (item.BudgetTotal / localTargetBoqItem.BudgetTotal) * 100;
					} else {
						item.BudgetPercent = 0;
					}
				} else {
					// if item is selected and not an original item selected, do the recalculation
					if (item.isSelect && !isInOriginalSelected) {
						item.BudgetTotal = item.BudgetPercent * localTargetBoqItem.BudgetTotal / 100;
					}
				}
			}

			// if item is not selected or not original data selected, it should be readonly
			const isReadonly = isInOriginalSelected || !item.isSelect;
			platformRuntimeDataService.readonly(item, [
				{ field: 'BudgetPercent', readonly: isReadonly },
				{ field: 'BudgetTotal', readonly: isReadonly }
			]);
		}

		function filterChildItems(item, args) {
			if (args.childAssignBoqIdsOfNotCurBoq && args.childAssignBoqIdsOfNotCurBoq.length > 0) {
				item.BoQItems = item.BoQItems.filter(e => args.childAssignBoqIdsOfNotCurBoq.indexOf(e.Id) === -1);
			}
		}

		function initBoqItems(boqItemsTemp, args) {
			let toRemove = [];
			_.forEach(boqItemsTemp, (item) => {
				const result = processBoqItem(item, args);
				if (result?.toRemove) {
					toRemove.push(result.toRemove);
				}
			});
			_.remove(boqItemsTemp, (e) => toRemove.some(item => item.Id === e.Id));
		}

		function processBoqItem(item, args) {
			if (!item || !args) {
				return {};
			}
			setItemSelection(item);
			setItemBudgetPercent(item, args.dontRecalculate);

			if (boqLineTypes.indexOf(item.BoqLineTypeFk) === -1) {
				platformRuntimeDataService.readonly(item, [{field: 'isSelect', readonly: true}]);
			}

			if (item.BoQItems && item.BoQItems.length > 0) {
				filterChildItems(item, args);

				const childrenToDelete = [];
				item.BoQItems.forEach((child) => {
					const result = processBoqItem(child, args);
					if (result?.toRemove) {
						childrenToDelete.push(result.toRemove);
					}
				});
				// remove children which is no longer a parent node
				_.remove(item.BoQItems, (e) => childrenToDelete.some((child) => child.Id === e.Id));

				// if parent has no children, remove parent node
				if (item.BoQItems.length === 0) {
					return {
						toRemove: item
					}
				}
			}

			return {};
		}
	}
})(angular);