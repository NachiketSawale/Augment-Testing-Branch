(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection

	/**
	 * @ngdoc controller
	 * @name basic.Material.basicsMaterialMaterialGroupsController
	 * @require $scope
	 * @description controller for basic material catalog
	 */
	angular.module('basics.material').controller('basicsMaterialMaterialGroupsController',
		['$scope', 'platformGridControllerService', 'basicsMaterialMaterialGroupsService',
			'basicsMaterialCatalogGroupUIStandardService', 'platformGridAPI', 'basicsCommonHeaderColumnCheckboxControllerService',
			function ($scope, gridControllerService, dataService, gridColumns, platformGridAPI, basicsCommonHeaderColumnCheckboxService) {

				dataService.setInitControllerStatus(true);
				var gridConfig = {
					columns: [],
					parentProp: 'MaterialGroupFk',
					childProp: 'ChildItems'
				};

				var checkAll = function checkAll(e) {
				    dataService.checkAllItem(e.target.checked);
				};
				var headerCheckBoxField = ['IsChecked'];
				var headerCheckBoxEvent = [
					{
					    source: 'grid',
					    name: 'onHeaderCheckboxChanged',
					    fn: checkAll
					}
				];


				var colDef = {
					id: 'IsChecked',
					field: 'IsChecked',
					name$tr$: 'basics.material.record.filter',
					formatter: function (row, cell, value, columnDef, dataContext, plainText, uniqueId) {
						var html = '';

						if (value === true) {
							html = '<input type="checkbox" checked/>';
						}
						else if (value === 'unknown') {
							setTimeout(function () {
								angular.element('#' + uniqueId).find('input[type=checkbox]').prop('indeterminate', true);
							});

							html = '<input type="checkbox"/>';
						}
						else {
							html = '<input type="checkbox" unchecked/>';
						}

						return '<div class="text-center">' + html + '</div>';
					},
					editor: 'directive',
					editorOptions: {
						directive: 'basics-material-checkbox'
					},
					width: 50,
					isTransient: true,
					headerChkbox: true,
					validator: 'isCheckedValueChange'
				};

				$scope.isCheckedValueChange = dataService.isCheckedValueChange;

				var columns = angular.copy(gridColumns.getStandardConfigForListView().columns);
				columns.unshift(colDef);
				var newColumns = {
					getStandardConfigForListView: function () {
						return {columns: columns};
					}
				};

				gridControllerService.initListController($scope, newColumns, dataService, null, gridConfig);

				basicsCommonHeaderColumnCheckboxService.init($scope, dataService, headerCheckBoxField, headerCheckBoxEvent);

				var setCellEditable = function (e, arg) {
					return arg.column.field === 'IsChecked';
				};

				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);
				dataService.setInitControllerStatus(false);
				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
				});
			}
		]);
})(angular);