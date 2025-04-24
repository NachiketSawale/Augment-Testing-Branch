(function (angular) {
	'use strict';
	var moduleName = 'basics.material';
	/* jshint -W072 */ // many parameters because of dependency injection

	/**
	 * @ngdoc controller
	 * @name basic.Material.basicsMaterialMaterialCatalogGridController
	 * @require $scope
	 * @description controller for basic material catalog
	 */
	angular.module(moduleName).controller('basicsMaterialMaterialCatalogGridController',
		['$scope', 'platformGridControllerService', 'basicsMaterialMaterialCatalogService',
			'basicsMaterialCatalogUIStandardService', 'platformGridAPI', 'basicsCommonHeaderColumnCheckboxControllerService',
			'documentsProjectDocumentModuleContext', '_',
			function ($scope, gridControllerService, dataService, uiStandardService, platformGridAPI, basicsCommonHeaderColumnCheckboxControllerService,documentsProjectDocumentModuleContext, _) {
				var gridConfig = {
					columns: []
				};

				var checkAll = function checkAll(e) {
					dataService.checkAllItems(e.target.checked);
				};
				var headerCheckBoxFields = ['IsChecked'];
				var headerCheckBoxEvents = [
					{
						source: 'grid',
						name: 'onHeaderCheckboxChanged',
						fn: checkAll
					},
					{
						source: 'dataService',
						name: 'materialCatalogChecksChanged'
					}
				];


				documentsProjectDocumentModuleContext.setConfig({
					moduleName: moduleName,
					parentService: dataService
				});

				var colDef = {
					id: 'IsChecked',
					field: 'IsChecked',
					name$tr$: 'basics.material.record.filter',
					formatter: 'boolean',
					editor: 'boolean',
					width: 50,
					isTransient:true,
					headerChkbox: true,
					validator: 'isCheckedValueChange',
					sortable:true
				};

				var tempColumns = angular.copy(uiStandardService.getStandardConfigForListView().columns);

				var isNeutralColumn = _.find(tempColumns, {'id': 'isneutral'});
				if (isNeutralColumn) {
					delete isNeutralColumn.editor;
				}

				var isTicketSystem = _.find(tempColumns, {'id': 'isticketsystem'});
				if (isTicketSystem) {
					delete isTicketSystem.editor;
				}

				tempColumns.unshift(colDef);
				var newColumns = {
					getStandardConfigForListView: function () {
						return {columns: tempColumns};
					}
				};







				$scope.isCheckedValueChange = dataService.isCheckedValueChange;


				gridControllerService.initListController($scope, newColumns, dataService, null, gridConfig);

				basicsCommonHeaderColumnCheckboxControllerService.init($scope, dataService, headerCheckBoxFields, headerCheckBoxEvents);

				var setCellEditable = function (e, arg) {
					return arg.column.field === 'IsChecked';
				};

				platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);


				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
				});
			}
		]);
})(angular);