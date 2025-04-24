/**
 * Created by lav on 7/22/2019.
 */

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.drawing';

	angular.module(moduleName).service('ppsDrawingPreviewDialogService', Service);

	Service.$inject = [
		'$http',
		'platformGridAPI',
		'ppsDrawingPreviewImageProcessor',
		'$interval',
		'$q',
		'$translate',
		'platformModalService',
		'productionplanningDrawingMainService',
		'previewResultType',
		'modifiedState'];

	function Service($http,
					 platformGridAPI,
					 ppsDrawingPreviewImageProcessor,
					 $interval,
					 $q,
					 $translate,
					 platformModalService,
					 drawingMainService,
					 previewResultType,
					 modifiedState) {
		var service = {};

		service.initializeController = function (scope) {
			var selectedDrawing = drawingMainService.getSelected();
			var updatedDrawing;
			const upstreamItemType = 'Upstream Item';
			scope.noteForUpstreamItem = '';

			scope.disableRefresh = function () {
				return scope.isBusy;
			};

			scope.disableApply = function () {
				return scope.hasErrors || scope.isBusy || (!scope.hasDiff && selectedDrawing.IsFullyAccounted === scope.isMatch);
			};

			scope.onRefresh = function () {
				scope.hasErrors = false;
				busy(true);
				$http.get(globals.webApiBaseUrl + 'productionplanning/drawing/preview?drawingId=' + selectedDrawing.Id).then(function (response) {
					if (response && response.data) {
						setList([response.data]).then(function () {
							scope.hasDiff = !!response.data.NumOfDiffs;
							scope.isMatch = response.data.IsMatch;
							busy(false);
							var errors = _.get(response.data.PLImportResult,'ErrorInfos');
							if (errors && errors.length > 0) {
								scope.hasErrors = true;
								platformModalService.showErrorBox(errors.join('<br>'),
									'productionplanning.drawing.checking');
							}
						});
					} else {
						busy(false);
					}
				}, function () {
					busy(false);
				});
			};
			service.onRefresh = scope.onRefresh;

			scope.onApply = function () {
				var modalOptions = {
					headerTextKey: 'cloud.common.apply',
					bodyTextKey: $translate.instant(moduleName + '.wizard.confirmApplyPreview'),
					showYesButton: true,
					showNoButton: true,
					iconClass: 'ico-question'
				};
				return platformModalService.showDialog(modalOptions).then(function (result) {
					if (result.yes) {
						busy(true);
						$http.get(globals.webApiBaseUrl + 'productionplanning/drawing/applyPreview?drawingId=' + selectedDrawing.Id).then(function (response) {
							if (response && response.data && response.data.Result) {
								if (response.data.Drawing) {
									selectedDrawing = updatedDrawing = response.data.Drawing;
								}
								scope.onRefresh();
							} else {
								busy(false);
							}
						}, function () {
							busy(false);
						});
					}
				});
			};

			service.successCallback = function () {
				if (updatedDrawing) {
					drawingMainService.updateSelection(updatedDrawing);
				}
			};

			scope.toggleColumnFilter = function (active, clearFilter) {
				platformGridAPI.filters.showColumnSearch(scope.gridId, active, clearFilter);
			};

			scope.toggleGroupPanel = function (active) {
				platformGridAPI.grouping.toggleGroupPanel(scope.gridId, active);
			};

			scope.toggleFilter = function (active, clearFilter) {
				platformGridAPI.filters.showSearch(scope.gridId, active, clearFilter);
			};

			function busy(flag) {
				scope.isBusy = flag;
			}

			service.busy = busy;

			function setSelected(selected) {
				if (selected) {
					var grid = platformGridAPI.grids.element('id', scope.gridId);
					grid.instance.resetActiveCell();
					platformGridAPI.rows.selection({
						gridId: scope.gridId,
						rows: [{
							Id: selected.Id
						}]
					});
				}
			}

			service.setSelected = setSelected;

			function getSelected() {
				return platformGridAPI.rows.selection({
					gridId: scope.gridId
				});
			}

			service.getSelected = getSelected;

			function setList(items) {
				var defer = $q.defer();
				var originalItems = [];
				var originalSelected;
				var grid = platformGridAPI.grids.element('id', scope.gridId);
				if (grid && grid.dataView) {
					originalItems = platformGridAPI.rows.getRows(scope.gridId);
					originalSelected = getSelected();
				}
				items = ppsDrawingPreviewImageProcessor.processData(items);
				setNoteForUpstreamItem(items);
				hideChildUpstreamItems(items);
				platformGridAPI.items.data(scope.gridId, items);
				if (items.length > 0) {
					var interval = $interval(function () {
						if (items[0].nodeInfo) {
							syncTheExpandStatus(originalItems, items, originalSelected, scope.gridId);
							platformGridAPI.grids.refresh(scope.gridId);
							$interval.cancel(interval);
						}
						defer.resolve();
					}, 0);
				} else {
					defer.resolve();
				}

				return defer.promise;

				function setNoteForUpstreamItem(items) {
					let note = '';
					const upstreamItemResult = items[0].ChildItems.filter(i => i.Type === upstreamItemType)[0];
					const hasDiff = upstreamItemResult ? upstreamItemResult.Diffs.length > 0 : false;

					if (hasDiff) {
						const diffs = upstreamItemResult.Diffs;
						const olds = upstreamItemResult.Olds;
						let state = '';
						let target = '';

						const hasCreated = diffs.some(i => i.PreviewInfo.ModifiedState === modifiedState.add);
						const hasUpdated = diffs.some(i => i.PreviewInfo.ModifiedState === modifiedState.modify);
						const hasDeleted = diffs.some(i => i.PreviewInfo.ModifiedState === modifiedState.delete);
						const targetToItem = diffs.some(i => i.PpsItemFk !== null);
						const targetToHeader = diffs.some(i => i.PpsItemFk === null);
						const targetUpdated = diffs.some(i => i.PreviewInfo.ModifiedState === modifiedState.modify && targetChanged(i, olds));

						if (hasCreated) {
							state += '/created';
						}
						if (hasUpdated) {
							state += '/updated';
						}
						if (hasDeleted) {
							state += '/deleted';
						}

						if (targetToItem || targetUpdated) {
							target += '/Planning Unit';
						}
						if (targetToHeader || targetUpdated) {
							target += '/Production Planning';
						}

						note = `Note: there are upstream items ${state.slice(1)} in the selected ${target.slice(1)}`;
					}

					scope.noteForUpstreamItem = note;

					function targetChanged(newItem, oldItems) {
						const oldItem = oldItems.filter(i => i.Id === newItem.Id)[0];
						return newItem.PpsItemFk !== oldItem.PpsItemFk;
					}
				}

				function hideChildUpstreamItems(parent) {
					parent.forEach(p => p.ChildItems = p.ChildItems.filter(i => i.Type !== upstreamItemType));
				}
			}

			function syncTheExpandStatus(originalItems, currentItems, originalSelected, gridId) {
				if (originalItems.length > 0 && currentItems.length > 0) {
					var originalStatus = [];
					getExpandStatus(originalItems, originalStatus);
					setExpandStatus(currentItems, originalStatus);
					platformGridAPI.grids.refresh(gridId);
					setSelected(originalSelected);
				} else if (currentItems.length > 0) {
					currentItems[0].nodeInfo.collapsed = false;
				}
			}

			function getExpandStatus(items, targetArray) {
				_.forEach(items, function (item) {
					targetArray.push({id: item.Id, collapsed: item.nodeInfo.collapsed});
					getExpandStatus(item.ChildItems, targetArray);
				});
			}

			function setExpandStatus(items, targetArray) {
				_.forEach(items, function (item) {
					var exist = _.find(targetArray, {id: item.Id});
					if (exist) {
						item.nodeInfo.collapsed = exist.collapsed;
					}
					setExpandStatus(item.ChildItems, targetArray);
				});
			}

			service.nextConflict = function nextConflict() {
				var items = platformGridAPI.rows.getRows(scope.gridId);
				if (items.length > 0) {
					return selectNextConflict(items, [], getSelected());
				}
			};

			function selectNextConflict(items, parents, selected, canSelect) {
				var expandNext = function (parent) {
					platformGridAPI.rows.expandNextNode(scope.gridId, parent);
				};
				if (items && items.length > 0) {
					for (var i = 0; i < items.length; i++) {
						var item = items[i];
						if (!canSelect) {
							canSelect = canSelect || (selected === null || item === selected);
						}
						if (canSelect && item !== selected && item.Type === previewResultType.article && hasConflict(item)) {
							if (parents) {
								_.forEach(parents, expandNext);
							}
							setSelected(item);
							return true;

						} else {
							parents = parents || [];
							parents.push(item);
							if (selectNextConflict(item.ChildItems, parents, selected, canSelect)) {
								return true;
							}
						}
					}
				}
			}

			var conflictItem = null;
			service.previousConflict = function previousConflict() {
				var items = platformGridAPI.rows.getRows(scope.gridId);
				if (items.length > 0) {
					conflictItem = null;
					return selectPreviousConflict(items, [], getSelected());
				}
			};

			function selectPreviousConflict(items, parents, selected, canSelect) {
				var expandNext = function (parent) {
					platformGridAPI.rows.expandNextNode(scope.gridId, parent);
				};
				if (items && items.length > 0) {
					for (var i = 0; i < items.length; i++) {
						var item = items[i];
						if (!canSelect) {
							canSelect = canSelect || (selected === null || item === selected);
						}
						if (canSelect) {
							if (conflictItem) {
								if (parents) {
									_.forEach(parents, expandNext);
								}
								setSelected(conflictItem);
							}
							return true;
						}
						if (item !== selected && item.Type === previewResultType.article && hasConflict(item)) {
							conflictItem = item;

						} else {
							parents = parents || [];
							if (item.ChildItems && item.ChildItems.length > 0) {
								parents.push(item);
							}
							if (selectPreviousConflict(item.ChildItems, parents, selected, canSelect)) {
								return true;
							}
						}
					}
				}
			}

			function hasConflict(item) {
				return item && !item.IsMatch;
			}
		};

		return service;
	}

})(angular);