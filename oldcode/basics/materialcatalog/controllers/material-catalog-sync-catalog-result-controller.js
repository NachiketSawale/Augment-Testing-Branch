/**
 * Created by xai on 7/12/2018.
 */
(function () {

	'use strict';
	var moduleName = 'basics.materialcatalog';
	var angModule = angular.module(moduleName);

	angModule.controller('basicsMaterialcatalogSyncCatalogResultController',
		['$scope', 'platformTranslateService','platformGridAPI', function ($scope, platformTranslateService,platformGridAPI) {
			$scope.options = $scope.$parent.modalOptions;
			var headerData=$scope.options.header;
			$scope.gridId = '4A7E94631E8D441FB635725946435E9C';
			$scope.gridResultData = {
				state: $scope.gridId
			};
			$scope.modalOptions = {
				actionButtonText: $scope.options.OkButton,
				headerText: $scope.options.headerText,
				bodyText:$scope.options.bodyText
			};
			var resultColumns = [
				{
					id: 'code', field: 'CatalogCode', name$tr$: 'basics.materialcatalog.itwocatalogcode',
					formatter: 'code',sortable: true, resizable: true
				},
				{
					id: 'companycode', field: 'CompanyCode', name$tr$: 'basics.materialcatalog.itwocompanycode',
					formatter: 'description', sortable: true, resizable: true
				},
				{
					id: 'materialcode', field: 'MaterialCode', name$tr$: 'basics.materialcatalog.materialCode',
					formatter: 'description', sortable: true, resizable: true
				}];
			platformTranslateService.translateGridConfig(resultColumns);

			initGrid();

			function initGrid() {
				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var grid = {
						columns: angular.copy(resultColumns),
						data: headerData,
						id: $scope.gridId,
						lazyInit: true,
						options: {tree: false, indicator: false, idProperty: 'Id'}
					};
					platformGridAPI.grids.config(grid);
					platformGridAPI.items.data($scope.gridId, headerData);
				}
				else {
					platformGridAPI.columns.configuration($scope.gridId, angular.copy(resultColumns));
				}
			}
			$scope.modalOptions.ok = function () {
				$scope.$close(false);
			};
			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
			});
		}
		]);
	angModule.controller('basicsMaterialcatalogValidationController',
		['$scope', 'platformTranslateService','platformGridAPI', function ($scope, platformTranslateService,platformGridAPI) {
			var validateData=$scope.options.header;
			$scope.gridId = '3F29D3B1DA454ADFB91B3BE814B99FBE';
			$scope.gridValidateData = {
				state: $scope.gridId
			};
			var validateColumns = [
				{
					id: 'CatalogCode', field: 'CatalogCode', name$tr$: 'basics.materialcatalog.itwocatalogcode',
					formatter: 'code',sortable: true, resizable: true
				},
				{
					id: 'CompanyCode', field: 'CompanyCode', name$tr$: 'basics.materialcatalog.itwocompanycode',
					formatter: 'description', sortable: true, resizable: true
				},
				{
					id: 'BpName', field: 'BpName', name$tr$: 'basics.materialcatalog.bpname',
					formatter: 'description', sortable: true, resizable: true
				}];
			platformTranslateService.translateGridConfig(validateColumns);
			initGrid();
			function initGrid() {
				if (!platformGridAPI.grids.exist($scope.gridId)) {
					var grid = {
						columns: angular.copy(validateColumns),
						data: validateData,
						id: $scope.gridId,
						lazyInit: true,
						options: {tree: false, indicator: false, idProperty: 'ItwoCatalogCode'}
					};
					platformGridAPI.grids.config(grid);
				}
				else {
					platformGridAPI.columns.configuration($scope.gridId, angular.copy(validateColumns));
				}
			}
			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}
			});
		}
		]);
})();