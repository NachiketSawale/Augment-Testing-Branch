/**
 * Created by anl on 9/29/2017.
 */

(function (angular) {
	'use strict';


	var moduleName = 'productionplanning.mounting';

	angular.module(moduleName).controller('productionplanningMountingRequisitionListInMntController', ProductionplanningMountingRequisitionListInMntController);

	ProductionplanningMountingRequisitionListInMntController.$inject = ['$scope', 'platformContainerControllerService',
		'platformTranslateService', 'productionplanningMoungtingRequisitionUIStandardService', 'platformGridAPI'];

	function ProductionplanningMountingRequisitionListInMntController($scope, platformContainerControllerService, platformTranslateService, uiStandardService,
									   platformGridAPI) {
		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);

		platformContainerControllerService.initController($scope, moduleName, 'd8e544ee17334b5da1ab7f906f65b741');

		var setCellEditable = function () {
			return false;
		};
		platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
		});
	}

})(angular);