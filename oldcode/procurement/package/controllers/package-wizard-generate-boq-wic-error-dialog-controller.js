/**
 * Created by chi on 9/30/2017.
 */
(function(angular){
	'use strict';
	var moduleName = 'procurement.package';

	angular.module(moduleName).controller('procurementPackageWizardGenerateBoqWicErrorDialogController', procurementPackageWizardGenerateBoqWicErrorDialogController);

	procurementPackageWizardGenerateBoqWicErrorDialogController.$inject = ['$scope', 'platformGridAPI', 'platformTranslateService'];

	function procurementPackageWizardGenerateBoqWicErrorDialogController($scope, platformGridAPI, platformTranslateService) {

		$scope.wicError = {};
		var errorListGridId = '9a5abe5e843244fcb6cc8a13ce1e2781';
		$scope.errorListData = {
			state: errorListGridId
		};
		var errorListColumn = [
			{
				id: 'Code',
				field: 'EstLineItemCode',
				name: 'Code',
				name$tr$: 'procurement.package.entityCode',
				formatter: 'Code',
				readonly: true,
				width: 100
			},
			{
				id: 'Description',
				field: 'EstLineItemDescription',
				name: 'Description',
				name$tr$: 'procurement.package.entityDescription',
				formatter: 'Description',
				width: 120,
				readonly: true
			},
			{
				id: 'wicGroupCode',
				field: 'WicGroupCode',
				name: 'WIC Group',
				name$tr$: 'procurement.package.wicError.wicGroupCode',
				formatter: 'Code',
				width: 160,
				readonly: true
			},
			{
				id: 'wicGroupDescription',
				field: 'WicGroupDescription',
				name: 'WIC Group Description',
				name$tr$: 'procurement.package.wicError.wicGroupDescription',
				formatter: 'Description',
				width: 160,
				readonly: true
			}
		];
		$scope.close = function () {
			$scope.$parent.$close(false);
		};
		$scope.$on('$destroy', function () {

		});

		init();
		// /////////////////////////////

		function init() {
			setupErrorListGrid();
			updateErrorListGrid();
		}

		function setupErrorListGrid() {
			if (!platformGridAPI.grids.exist(platformGridAPI)) {
				var selectionGridConfig = {
					columns: errorListColumn,
					data: $scope.modalOptions.errorList || [],
					id: errorListGridId,
					lazyInit: true,
					options: {
						tree: false,
						indicator: true,
						idProperty: 'EstLineItemFk',
						iconClass: ''
					}
				};
				platformGridAPI.grids.config(selectionGridConfig);
				platformTranslateService.translateGridConfig(selectionGridConfig.columns);
			}
		}

		function updateErrorListGrid() {
			platformGridAPI.grids.invalidate(errorListGridId);
			platformGridAPI.items.data(errorListGridId, $scope.modalOptions.errorList);
		}
	}
})(angular);