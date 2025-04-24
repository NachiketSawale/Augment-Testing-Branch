(function (angular) {
	'use strict';
	/* global _ */
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc controller
	 * @name constructionSystemMainObjectSetListController
	 * @requires $scope
	 * @description
	 * #
	 * Controller for constructionSystem main objectset grid.
	 */
	angular.module(moduleName).controller('constructionSystemMainObjectSetListController', [
		'$scope', '$translate', 'platformGridAPI', 'platformGridControllerService', 'modelMainObjectSetConfigurationService',
		'constructionSystemMainObjectSetService', 'constructionSystemMainClipboardService', 'constructionSystemHighlightToggleService',
		'constructionSystemMainObjectSet2ObjectService',
		function ($scope, $translate, platformGridAPI, platformGridControllerService, modelMainObjectSetConfigurationService,
			dataService, cosMainClipboardService, constructionSystemHighlightToggleService,
			constructionSystemMainObjectSet2ObjectService) {

			var gridConfig = {
				columns: [],
				type: 'cosObjectSet',
				dragDropService: cosMainClipboardService
			};

			var listConfig = angular.copy(modelMainObjectSetConfigurationService.getStandardConfigForListView());

			// set all grid columns readonly
			_.each(listConfig.columns, function (col) {
				if (col.editor) {
					col.editor = null;
					if (col.editorOptions) {
						col.editorOptions = null;
					}
				}
			});

			var uiConfigService = {
				getStandardConfigForListView: function () {
					return listConfig;
				}
			};

			platformGridControllerService.initListController($scope, uiConfigService, dataService, null, gridConfig);

			// remove toolbars
			var removeItems = ['create', 'delete', 'createChild'];
			$scope.tools.items = _.filter($scope.tools.items, function (item) {
				return item && removeItems.indexOf(item.id) === -1;
			});

			// use for 3DViewer highlight toggle between main object and assigned object
			var toggleHighlight = function toggleHighlight() {
				var t1000 = _.filter($scope.tools.items, {id: 't1000'})[0];
				t1000.value = constructionSystemHighlightToggleService.highlight.isObjectSet();
				$scope.tools.update();
			};

			constructionSystemHighlightToggleService.onBarToolHighlightStatusChanged.register(toggleHighlight);

			$scope.tools.items.unshift({
				id: 't1000',
				sort: 2,
				caption: $translate.instant('constructionsystem.main.toggleHighlight'),
				type: 'check',
				iconClass: 'tlb-icons ico-view-select',
				value: constructionSystemHighlightToggleService.highlight.isObjectSet(),
				fn: function () {
					if (dataService.hasSelection()) {
						constructionSystemMainObjectSet2ObjectService.load().then(function () {
							constructionSystemHighlightToggleService.toggleHighlight(constructionSystemMainObjectSet2ObjectService.getList(),
								constructionSystemHighlightToggleService.highlight.objectSet);
						});
					} else {
						constructionSystemHighlightToggleService.setCurrentHighlight(constructionSystemHighlightToggleService.highlight.objectSet);
						constructionSystemHighlightToggleService.onBarToolHighlightStatusChanged.fire();
					}
				}
			});

			function highlightObjectIn3DView() {
				if (dataService.hasSelection()) {
					constructionSystemMainObjectSet2ObjectService.load().then(function () {
						constructionSystemHighlightToggleService.toggleHighlight(constructionSystemMainObjectSet2ObjectService.getList(),
							constructionSystemHighlightToggleService.highlight.objectSet);
					});
				}
			}


			dataService.registerSelectionChanged(highlightObjectIn3DView);

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', getSelectedItems);
			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', getSelectedItems);
				dataService.unregisterSelectionChanged(highlightObjectIn3DView);
				constructionSystemHighlightToggleService.onBarToolHighlightStatusChanged.unregister(toggleHighlight);
			});

			/**
			 * get the selected items.
			 * currently, the platformGridAPI has no direct method to get multiple selected items.
			 */
			function getSelectedItems(e, arg) {
				var rowItems = platformGridAPI.rows.getRows($scope.gridId);
				var selectedItems = [];
				if (arg) {
					angular.forEach(arg.rows, function (row) {
						var item = rowItems[row];
						if (item) {
							selectedItems.push(item);
						}
					});
				}
				dataService.selectedItems = selectedItems;
			}
		}
	]);
})(angular);
