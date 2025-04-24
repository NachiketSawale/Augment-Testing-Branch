/**
 * Created by chi on 11/9/2017.
 */
(function() {
	'use strict';
	var moduleName = 'basics.material';

	angular.module(moduleName).controller('basicsMaterialImportMaterialRecordsErrorController', basicsMaterialImportMaterialRecordsErrorController);

	basicsMaterialImportMaterialRecordsErrorController.$inject = ['$scope', 'platformGridAPI', 'platformTranslateService'];

	function basicsMaterialImportMaterialRecordsErrorController($scope, platformGridAPI, platformTranslateService) {

		var errorGridId = '895cb922447042f8923942ec6be5ed19';
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
		///////////////////////////////

		function init() {
			setupGrid();
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