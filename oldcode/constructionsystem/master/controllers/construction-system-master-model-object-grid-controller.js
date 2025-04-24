(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';

	angular.module(moduleName).controller('constructionSystemMasterModelObjectGridController', [
		'$scope', 'platformGridControllerService', 'constructionSystemMasterModelObjectUIStandardService',
		'constructionSystemMasterModelObjectDataService', 'platformGridAPI', '$injector',
		function ($scope, platformGridControllerService, uiStandardService, dataService, platformGridAPI, $injector) {
			var gridConfig = {
				idProperty: 'IdString',
				columns: []
			};
			var newColumn = {
				id: 'IsChecked',
				field: 'IsChecked',
				name$tr$: 'constructionsystem.master.entityFilter',
				formatter: 'boolean',
				editor: 'boolean',
				width: 50,
				headerChkbox: true,
				validator: 'isCheckedValueChange',
				sortable: true
			};

			var columns = angular.copy(uiStandardService.getStandardConfigForListView().columns);
			columns.unshift(newColumn);

			var columnsDef = {
				getStandardConfigForListView: function () {
					return {columns: columns};
				},
				getDtoScheme: uiStandardService.getDtoScheme
			};

			$scope.isCheckedValueChange = dataService.isCheckedValueChange;

			platformGridControllerService.initListController($scope, columnsDef, dataService, null, gridConfig);

			$scope.tools.items.unshift({
				id: 't10',
				type: 'item',
				caption: 'constructionsystem.master.filterObjectBySelectionStatment',
				iconClass: 'tlb-icons ico-refresh',
				fn: function () {
					dataService.filterObjects();
				}
			});

			var setCellEditable = function (e, arg) {
				return arg.column.field === 'IsChecked';
			};
			var checkAll = function checkAll(e) {
				dataService.checkAllItems(e.target.checked);
			};

			platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);
			platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', checkAll);

			function costGroupLoaded(costGroupCatalogs){
				$injector.get('basicsCostGroupAssignmentService').addCostGroupColumns($scope.gridId, columnsDef, costGroupCatalogs, dataService, {});
			}
			dataService.onCostGroupCatalogsLoaded.register(costGroupLoaded);

			/* refresh the columns configuration when controller is created */
			if(dataService.costGroupCatalogs){
				costGroupLoaded(dataService.costGroupCatalogs);
			}

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
				platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', checkAll);
				dataService.onCostGroupCatalogsLoaded.unregister(costGroupLoaded);
			});
		}
	]);
})(angular);