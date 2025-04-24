/**
 * Created by gaz on 9/7/2018.
 */

(function (angular) {

	'use strict';

	var moduleName = 'procurement.package';
	angular.module(moduleName).controller('procurementPackageItemMaterialAiAdditionStep2Controller', [
		'$scope', 'procurementPackageItemMaterialAiAdditionUIStandardService', 'procurementPackageItemMaterialAiAdditionDataService', 'basicsCommonDialogGridControllerService',
		function ($scope, UIStandard, dataService, dialogGridControllerService) {

			var gridConfig = {
				initCalled: false,
				columns: [],
				uuid: '54578541574a458787927413986A109f',
				height: '70%'
			};
			$scope.options.height = 0;

			dialogGridControllerService.initListController($scope, UIStandard, dataService, null, gridConfig);
		}
	]);


})(angular);