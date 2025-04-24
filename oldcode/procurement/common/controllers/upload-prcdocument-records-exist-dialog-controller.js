/**
 * Created by pel on 2/4/2021.
 */
(function() {
	'use strict';
	var moduleName = 'procurement.common';

	angular.module(moduleName).controller('uploadPrcDocumentRecordsExistController', uploadPrcDocumentRecordsExistController);

	uploadPrcDocumentRecordsExistController.$inject = ['$scope', 'platformGridAPI', 'platformTranslateService'];

	function uploadPrcDocumentRecordsExistController($scope, platformGridAPI, platformTranslateService) {

		var errorGridId = '6086b50d10a84776b96bbb935396987e';
		var errorGridColumns = [
			{
				id: 'info',
				field: 'Info',
				name: 'Information',
				name$tr$: 'basics.common.taskBar.info',
				width: 400,
				formatter: 'remark',
				sortable: true
			}
		];
		$scope.errorListData = {
			state: errorGridId
		};

		init();
		// /////////////////////////////

		$scope.onOK = function () {
			$scope.$close({yes: true});
		};

		$scope.onCancel = function () {
			// basicsLookupdataLookupFilterService.unregisterFilter(filters);
			// $scope.dataItem.__rt$data.errors = null;
			$scope.$close(false);
		};

		$scope.onClose = function () {
			// basicsLookupdataLookupFilterService.unregisterFilter(filters);
			// $scope.dataItem.__rt$data.errors = null;
			$scope.$close(false);
		};

		function init() {
			setupGrid();
			// var displayDatas = [];
			// $scope.modalOptions.infoList.forEach(function (result,index) {
			//     var item = {Id: index,Info: result.FileName};
			//     displayDatas.push(item);
			// });
			updateGrid($scope.modalOptions.infoList);
		}

		function setupGrid() {

			var columns = angular.copy(errorGridColumns);

			if (!platformGridAPI.grids.exist(errorGridId)) {
				var errorGridConfig = {
					columns: columns,
					data: [],
					id: errorGridId,
					lazyInit: true,
					options: {
						tree: false,
						indicator: true,
						idProperty: 'Id',
						iconClass: ''
					}
				};
				platformGridAPI.grids.config(errorGridConfig);
				platformTranslateService.translateGridConfig(errorGridConfig.columns);
			}
		}

		function updateGrid(resultGridData) {
			platformGridAPI.grids.invalidate(errorGridId);
			platformGridAPI.items.data(errorGridId, resultGridData);
		}
	}
})();