/**
 * Created by wuj on 11/13/2015.
 */
(function (angular) {
	'use strict';
	angular.module('procurement.package').constant('ImportStatusConstant', {
		Running: 0,
		Canceled: 1,
		Succeed: 2,
		Failed: 3
	});
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('procurement.package').controller('procurementPackageImportGridController',
		['$scope', '$timeout', 'platformGridControllerService', 'procurementPackageImportService',
			'procurementPackagePackageImportUIStandardService', 'platformToolbarService',
			function ($scope, $timeout, gridControllerService, dataService, gridColumns, platformToolbarService) {
				var gridConfig = {
					initCalled: false,
					columns: []
				};

				var colDef = [
					{
						id: 'ProcurementPackageWarning',
						field: 'WarningMessage',
						name$tr$: 'procurement.package.import.warningMessage',
						editor:'lookup',
						editorOptions: {
							directive: 'package-import-warning-dialog'
						},
						width: 260
					},
					{
						id: 'PackageTime',
						field: 'InsertedAt',
						formatter:'dateutc',
						name$tr$: 'procurement.package.import.time',
						width: 150
					}
				];
				var tempColumns = angular.copy(gridColumns.getStandardConfigForListView().columns);
				_.forEach(colDef,function(item){
					tempColumns.unshift(item);
				});
				var newColumns = {
					getStandardConfigForListView:function(){
						return{columns:tempColumns};
					}
				};
				gridControllerService.initListController($scope, newColumns, dataService, {}, gridConfig);

				var tools = platformToolbarService.getTools($scope.getContainerUUID());
				for (var i = 0; i < tools.length; i++) {
					if (tools[i].id === 'create') {
						tools[i].caption = 'cloud.common.taskBarImport';
					}

					if (tools[i].id === 'delete') {
						tools[i].caption = 'cloud.common.taskBarCancel';
					}
				}
			}
		]);
})(angular);