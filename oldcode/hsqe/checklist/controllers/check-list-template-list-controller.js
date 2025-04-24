(function (angular) {
	/* global globals, _ */

	'use strict';

	var moduleName = 'hsqe.checklist';

	/**
	 * @ngdoc controller
	 * @name checkListTemplateListController
	 * @requires $scope
	 * @description
	 */
	angular.module(moduleName).controller('checkListTemplateListController', [
		'$scope', 'platformGridControllerService', 'hsqeCheckListGroupTemplateUIStandardService',
		'hsqeCheckListTemplateDataService', 'hsqeCheckListClipBoardService', 'platformGridAPI',
		function ($scope, platformGridControllerService, gridColumns,
			dataService, clipboardService, platformGridAPI) {
			$scope.path = globals.appBaseUrl;
			$scope.isCheckedValueChange = dataService.isCheckedValueChange;

			platformGridControllerService.initListController($scope, gridColumns, dataService, {}, {
				type: 'hsqeCheckListTemplateDataService',
				dragDropService: clipboardService,
				extendDraggedData: function (draggedData) {
					draggedData.modelDataSource = clipboardService.myDragdropAdapter;
				}
			});

			$scope.ddTarget.registerDragStarted(function () {
				// clipboardService.setDropMessageToViewer('create instance');
			});

			// remove toolbars
			var removeItems = ['create', 'delete', 'createChild'];
			$scope.tools.items = _.filter($scope.tools.items, function (item) {
				return item && removeItems.indexOf(item.id) === -1;
			});

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', getSelectedItems);
			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', getSelectedItems);
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
