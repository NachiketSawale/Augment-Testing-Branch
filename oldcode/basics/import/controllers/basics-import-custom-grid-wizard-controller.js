/**
 * $Id: estimate-main-generate-estimate-from-boq-wizard-controller.js 25225 2022-01-18 18:45:02Z badugula $
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals */
	'use strict';

	let moduleName = 'basics.import';

	angular.module(moduleName).controller('basicsImportCustomGridWizardController', ['$scope','$timeout','$translate','platformGridAPI','basicImportCustomEstimateService',
		function ($scope,$timeout,$translate,platformGridAPI,basicImportCustomEstimateService) {

			$scope.path = globals.appBaseUrl;
			// $scope.modalOptions.headerText = "";
			$scope.dataItem = basicImportCustomEstimateService.getFormConfiguration();
			if($scope.dataItem.searchCriteria){
				basicImportCustomEstimateService .dataItem.searchCriteria = $scope.dataItem.searchCriteria;
			}
		   let gridColumns = $scope.gridColumns;
			$scope.gridColumnsResource=_.map(gridColumns,function (column){
				return 	{
					id: column.Id,
					field: column.SourceFieId,
					name:   column.SourceFieId,
					formatter: 'description',
					width: 150,
					name$tr$: 'basics.import.column.DesctinationFieId'
				};
			});
			$scope.BoqItems = $scope.gridData;
			$scope.gridId = '3a55b53e0565457396e83acf9830c899';
			let formConfig = basicImportCustomEstimateService.getFormConfiguration();
			if(!$scope.gridColumns)
			{
				basicImportCustomEstimateService.gridData = $scope.gridData;
			}

			$scope.formOptions = {
				configure: formConfig
			};

			$scope.formContainerOptions = {
				formOptions: $scope.formOptions,
				setTools: function () {
				}
			};

			$scope.onOK = function () {
				$scope.$close({ok: true, data: $scope.gridData});
			};

			$scope.onCancel = function () {
				$scope.gridData.__rt$data.errors = null;
				$scope.$close({});
			};


			$scope.$on('$destroy', function () {

			});
			platformGridAPI.grids.config($scope.formOptions);

			$timeout(function () {
				platformGridAPI.items.data($scope.gridId, $scope.BoqItems);
				platformGridAPI.grids.resize($scope.gridId);
			});
		}]);
})(angular);
