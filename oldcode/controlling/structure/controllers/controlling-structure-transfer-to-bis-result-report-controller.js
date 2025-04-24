/**
 * Created by mov on 10/9/2019.
 */

(function (angular) {

	'use strict';
	var moduleName = 'controlling.structure';


	/**
     * @ngdoc service
     * @name controllingStructureTransferToBisResultReportController
     * @function
     *
     * @description
     * Controller for a modal dialogue displaying the data in a form container for controllingStructureTransferToBisResultReportController
     **/
	angular.module(moduleName).controller('controllingStructureTransferToBisResultReportController', [
		'$scope', '_', 'platformTranslateService', '$translate', 'controllingStructureTransferDataToBisDataReportService', 'platformGridAPI', '$timeout',
		function ($scope, _, platformTranslateService, $translate, controllingStructureTransferDataToBisDataReportService, platformGridAPI, $timeout) {

			var data = $scope.$parent.modalOptions.dataItems || {};

			let transferReport = controllingStructureTransferDataToBisDataReportService.processData2(data);

			$scope.dataItem = transferReport;

			$scope.dataItem.showTransferLog = $scope.dataItem.transferLogDetails !== '';

			$scope.modalTitle = $scope.modalOptions.headerText;

			$scope.inputOpen = true;

			$scope.transferedRecordsGridId = '6e6be58b23f940a4abffca383320a0ba';
			$scope.transferedRecordsGridData = {
				state: $scope.transferedRecordsGridId
			};

			$scope.transferWarningDetailsGridId = 'c23e378a0e49443fba25aabd391108c8';
			$scope.transferWarningDetailsGridData = {
				state: $scope.transferWarningDetailsGridId
			};

			$scope.transferQuantityCheckGridId = 'df240c2f5895493c9362a412987f8a38';
			$scope.transferQuantityCheckGridData = {
				state: $scope.transferQuantityCheckGridId
			};

			$scope.transferTotalCompareGridId = '5b5554281fea474cbefe3f20e3ed21da';
			$scope.transferTotalCompareGridData = {
				state: $scope.transferTotalCompareGridId
			};

			var transferedRecordsColumns = {
				EstLineItem : {
					id: 'EstLineItem',
					field: 'EstLineItem',
					name: 'EstLineItem',
					formatter: 'code',
					width: 200,
					name$tr$: moduleName + '.transferdatatobisExecutionReport.estLineItem'
				},
				AQQuantityTotal : {
					id: 'AQQuantityTotal',
					field: 'AQQuantityTotal',
					name: 'AQQuantityTotal',
					formatter: 'description',
					width: 200,
					name$tr$: moduleName + '.transferdatatobisExecutionReport.quantityCheck.aqQuantityTotal'
				},
				WQQuantityTotal : {
					id: 'WQQuantityTotal',
					field: 'WQQuantityTotal',
					name: 'WQQuantityTotal',
					formatter: 'description',
					width: 200,
					name$tr$: moduleName + '.transferdatatobisExecutionReport.quantityCheck.wqQuantityTotal'
				},
				AQQuantity : {
					id: 'AQQuantity',
					field: 'AQQuantity',
					name: 'AQQuantity',
					formatter: 'description',
					width: 200,
					name$tr$: moduleName + '.transferdatatobisExecutionReport.quantityCheck.aqQuantity'
				},
				WQQuantity : {
					id: 'WQQuantity',
					field: 'WQQuantity',
					name: 'WQQuantity',
					formatter: 'description',
					width: 200,
					name$tr$: moduleName + '.transferdatatobisExecutionReport.quantityCheck.wqQuantity'
				},
				StructureName : {
					id: 'StructureName',
					field: 'StructureName',
					name: 'StructureName',
					formatter: 'code',
					width: 200,
					name$tr$: moduleName + '.transferdatatobisExecutionReport.transferedStructure'
				},
				Description :  {
					id: 'Description',
					field: 'Description',
					name: 'Description',
					formatter: 'description',
					width: 200,
					name$tr$: moduleName + '.transferdatatobisExecutionReport.recordCount'
				},
				TotalType : {
					id: 'TotalType',
					field: 'TotalType',
					name: 'TotalType',
					formatter: 'description',
					width: 200,
					name$tr$: moduleName + '.transferdatatobisExecutionReport.totalComparison.totalType'
				},
				AQValueEstimate : {
					id: 'AQValueEstimate',
					field: 'AQValueEstimate',
					name: 'AQValueEstimate',
					formatter: 'description',
					width: 200,
					name$tr$: moduleName + '.transferdatatobisExecutionReport.totalComparison.aqValueEstiamte'
				},
				AQValueControlling : {
					id: 'AQValueControlling',
					field: 'AQValueControlling',
					name: 'AQValueControlling',
					formatter: 'description',
					width: 200,
					name$tr$: moduleName + '.transferdatatobisExecutionReport.totalComparison.aqValueControlling'
				},
				AQDifference : {
					id: 'AQDifference',
					field: 'AQDifference',
					name: 'AQDifference',
					formatter: 'description',
					width: 200,
					name$tr$: moduleName + '.transferdatatobisExecutionReport.totalComparison.aqDifference'
				},
				WQValueEstimate : {
					id: 'WQValueEstimate',
					field: 'WQValueEstimate',
					name: 'WQValueEstimate',
					formatter: 'description',
					width: 200,
					name$tr$: moduleName + '.transferdatatobisExecutionReport.totalComparison.wqValueEstiamte'
				},
				WQValueControlling : {
					id: 'WQValueControlling',
					field: 'WQValueControlling',
					name: 'WQValueControlling',
					formatter: 'description',
					width: 200,
					name$tr$: moduleName + '.transferdatatobisExecutionReport.totalComparison.wqValueControlling'
				},
				WQDifference : {
					id: 'WQDifference',
					field: 'WQDifference',
					name: 'WQDifference',
					formatter: 'description',
					width: 200,
					name$tr$: moduleName + '.transferdatatobisExecutionReport.totalComparison.wqDifference'
				}

			};

			if (!transferedRecordsColumns.isTranslated) {
				platformTranslateService.translateGridConfig(transferedRecordsColumns);
				transferedRecordsColumns.isTranslated = true;
			}

			function init(){
				if(!transferReport){
					return;
				}

				let columns = [];
				let data = [];

				if(transferReport.transferedRecordDetails){
					initializeGrid($scope.transferedRecordsGridId, [transferedRecordsColumns.StructureName, transferedRecordsColumns.Description], transferReport.transferedRecordDetails, false);
				}

				// Assignment Check
				let hasAssignmentCheckWarning = _.isArray(transferReport.transferWarningDetails) && transferReport.transferWarningDetails.length > 0;
				columns = hasAssignmentCheckWarning ? [transferedRecordsColumns.StructureName, transferedRecordsColumns.Description] : [];
				data = hasAssignmentCheckWarning ? transferReport.transferWarningDetails : [];
				initializeGrid($scope.transferWarningDetailsGridId, columns, data, true);
				$scope.dataItem.showAssignmentCheckGrid = hasAssignmentCheckWarning;

				// LineItem Planned Quantity Check
				let hasQuantityCheckWarning = _.isArray(transferReport.transferQuantityCheckDetails) && transferReport.transferQuantityCheckDetails.length > 0;
				columns = hasQuantityCheckWarning ?
					[transferedRecordsColumns.EstLineItem, transferedRecordsColumns.AQQuantityTotal, transferedRecordsColumns.AQQuantity, transferedRecordsColumns.WQQuantityTotal, transferedRecordsColumns.WQQuantity] : [];
				data = hasQuantityCheckWarning ? transferReport.transferQuantityCheckDetails : [];
				initializeGrid($scope.transferQuantityCheckGridId, columns, data, false);
				$scope.dataItem.showQuantityCheckGrid = hasQuantityCheckWarning;

				// LineItem Total Comparison
				let hasTotalComparison = _.isArray(transferReport.transferTotalCompareDetails) && transferReport.transferTotalCompareDetails.length > 0;
				columns = hasTotalComparison ?
					[transferedRecordsColumns.TotalType, transferedRecordsColumns.AQValueEstimate, transferedRecordsColumns.AQValueControlling, transferedRecordsColumns.AQDifference,
						transferedRecordsColumns.WQValueEstimate, transferedRecordsColumns.WQValueControlling, transferedRecordsColumns.WQDifference] : [];
				data = hasTotalComparison ? transferReport.transferTotalCompareDetails : [];
				initializeGrid($scope.transferTotalCompareGridId, columns, data, false);
				$scope.dataItem.transferTotalCompareGridId = hasTotalComparison;

			}

			function initializeGrid(gridId, columns, data, isTree) {
				if (!platformGridAPI.grids.exist(gridId)) {
					let grid = {
						columns: angular.copy(columns),
						data: data ? data : [],
						id: gridId,
						lazyInit: false,
						enableConfigSave: false,
						options: {
							tree: isTree,
							childProp: 'LogDetail',
							indicator: true,
							idProperty: 'Id',
							skipPermissionCheck: true
						}
					};

					platformGridAPI.grids.config(grid);

					$timeout(function () {
						platformGridAPI.grids.resize(gridId);
					});
				}
				else {
					platformGridAPI.columns.configuration(gridId, angular.copy(columns));
					platformGridAPI.items.data(gridId, data ? data : []);
				}
			}

			/* TODO: please check, seems to be never used (hideGrid)
			function hideGrid(gridId){
				if (!platformGridAPI.grids.exist(gridId)) {
					var grid = {
						columns: angular.copy([]),
						data: [],
						id: gridId,
						lazyInit: false,
						enableConfigSave: false,
						options: {
							tree: false,
							indicator: true,
							idProperty: 'Id'
						}
					};

					platformGridAPI.grids.config(grid);

					$timeout(function () {
						platformGridAPI.grids.resize(gridId);
					});
				}
				else {
					platformGridAPI.columns.configuration(gridId, []);
					platformGridAPI.items.data(gridId, []);
				}
			}
			*/

			let testData = {};
			testData.Id = 1;
			testData.Code = 'A';
			testData.Description = 'a description';

			init();

			$scope.onOK = function () {
				$scope.$close({ok: true, data: $scope.dataItem});
			};

			$scope.$on('$destroy', function () {
				if (platformGridAPI.grids.exist($scope.transferedRecordsGridId)) {
					platformGridAPI.grids.unregister($scope.transferedRecordsGridId);
				}
			});
		}
	]);
})(angular);
