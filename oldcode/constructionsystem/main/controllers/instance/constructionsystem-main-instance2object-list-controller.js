(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainInstance2ObjectListController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for constructionSystem main instance2object grid.
	 */
	angular.module(moduleName).controller('constructionSystemMainInstance2ObjectListController', [
		'$q', '$scope', '$translate', '$injector', 'platformGridControllerService', 'constructionSystemMainInstance2ObjectUIConfigService',
		'constructionSystemMainInstance2ObjectService', 'constructionSystemMainClipboardService', 'platformGridAPI',
		'constructionSystemHighlightToggleService', 'constructionSystemMainDimensionService', 'constructionSystemMainInstanceService',
		'modelWdeViewerWdeService', 'modelViewerCompositeModelObjectSelectionService',
		function ($q, $scope, $translate, $injector, platformGridControllerService, uiConfigService,
			dataService, cosMainClipboardService, platformGridAPI,
			constructionSystemHighlightToggleService, constructionSystemMainDimensionService,
			constructionSystemMainInstanceService, modelWdeViewerWdeService, modelViewerCompositeModelObjectSelectionService) {

			platformGridControllerService.initListController($scope, uiConfigService, dataService, {}, {
				type: 'cosMainInstance2Object',
				dragDropService: cosMainClipboardService
			});

			var origCanDrop = $scope.ddTarget.canDrop;
			$scope.ddTarget.canDrop = function (info) {
				if (info.draggedData && info.draggedData.draggingFromViewer) { // code that determines whether the dragged data can be handled
					return !!dataService.parentService().getSelected();
				} else {
					return origCanDrop.call($scope.ddTarget, info);
				}
			};

			var origDrop = $scope.ddTarget.drop;
			$scope.ddTarget.drop = function (info) {
				if (info.draggedData && info.draggedData.draggingFromViewer) { // code that determines whether the dragged data can be handled
					// handle dragged data
					cosMainClipboardService.copyObjectsFromViewer(info);
				} else {
					origDrop.call($scope.ddTarget, info);
				}
			};

			// TODO: platformGridAPI.rows.selection need get Selected Rows Items, but now it can't
			function getGridItemList(gridId) {
				return platformGridAPI.rows.getRows(gridId);
			}

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', function (e, arg) {
				constructionSystemHighlightToggleService.setAssObjSelectionOnViewer(e, arg, getGridItemList($scope.gridId));
			});

			var removeItems = ['create', 'createChild'];
			$scope.tools.items = _.filter($scope.tools.items, function (item) {
				return item && removeItems.indexOf(item.id) === -1;
			});

			var modelId = constructionSystemMainInstanceService.getCurrentSelectedModelId();

			modelWdeViewerWdeService.is2DModel(modelId).then(function (res) {
				if (res) {
					$scope.addTools([
						{
							id: 'deleteDimension',
							sort: 10,
							caption: 'constructionsystem.main.deleteDimension',
							type: 'item',
							iconClass: 'tlb-icons ico-delete',
							fn: function () {
								var uuids = dataService.getSelectedEntities().map(function (entity) {
									return entity.CpiId;
								});

								$injector.get('constructionSystemMainIgeDimensionService').deleteDimensionsByUuid(modelId, uuids);
							},
							disabled: function () {
								var selected = dataService.getSelected();
								return !selected || !selected.CpiId;
							}
						}
					]);
				}
			});
			constructionSystemHighlightToggleService.setCurrentHighlight(constructionSystemHighlightToggleService.highlight.assignObject);
			var selectBtn = {
				id: 't1000',
				sort: 2,
				caption: $translate.instant('constructionsystem.main.toggleHighlight'),
				type: 'check',
				iconClass: 'tlb-icons ico-view-select',
				value:  constructionSystemHighlightToggleService.highlight.isAssignObject(),
				fn: function (id, item) {
					if (item.value) {
						constructionSystemHighlightToggleService.toggleHighlight(getGridItemList($scope.gridId),
							constructionSystemHighlightToggleService.highlight.assignObject);
					} else {
						constructionSystemHighlightToggleService.toggleHighlight([], '');
					}
				}
			};

			$scope.addTools([
				selectBtn
			]);

			var toggleHighlight = function toggleHighlight() {
				var t1000 = _.filter($scope.tools.items, {id: 't1000'})[0];
				t1000.value = constructionSystemHighlightToggleService.highlight.isAssignObject();
				$scope.tools.update();
			};
			constructionSystemHighlightToggleService.onBarToolHighlightStatusChanged.register(toggleHighlight);

			modelViewerCompositeModelObjectSelectionService.registerSelectionChanged(handleModelViewerObjectSelection);

			function handleModelViewerObjectSelection() {
				if (!selectBtn.value) {
					// object selection direction is from container to viewer
					return;
				}

				// #135894 - object selection direction is from viewer to container
				var selectedObjectIds = modelViewerCompositeModelObjectSelectionService.getSelectedObjectIds();
				var modelObjectIds = selectedObjectIds.useGlobalModelIds();
				var list = dataService.getList();

				if (list && list.length) {
					list.some(function (item) {
						var model = modelObjectIds[item.ModelFk];

						if (model && model.length) {
							if (model.some(function (objectId) {
								return objectId === item.ObjectFk;
							})) {
								dataService.setSelected(item);
								return true;
							}
						}

						return false;
					});
				}
			}

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', constructionSystemHighlightToggleService.setAssObjSelectionOnViewer);
				constructionSystemHighlightToggleService.onBarToolHighlightStatusChanged.unregister(toggleHighlight);
				modelViewerCompositeModelObjectSelectionService.unregisterSelectionChanged(handleModelViewerObjectSelection);
			});
		}
	]);
})(angular);