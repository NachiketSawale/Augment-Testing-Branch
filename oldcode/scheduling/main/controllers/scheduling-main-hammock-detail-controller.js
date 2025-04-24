/**
 * Created by nitsche on 13.06.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainHammockDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of scheduling main hammock entities.
	 **/
	angular.module(moduleName).controller('schedulingMainHammockDetailController', SchedulingMainHammockDetailController);

	SchedulingMainHammockDetailController.$inject = ['$scope', 'platformContainerControllerService', 'platformContainerCreateDeleteButtonService', 'schedulingMainService', 'schedulingMainHammockDataService'];

	function SchedulingMainHammockDetailController($scope, platformContainerControllerService, platformContainerCreateDeleteButtonService, schedulingMainService, schedulingMainHammockDataService) {
		platformContainerControllerService.initController($scope, moduleName, 'd0cfd4e89e634a4fb99c8a14c6fa057e');

		var updateStateOfToolBarButtons = function updateStateOfToolBarButtons(){
			platformContainerCreateDeleteButtonService.toggleButtons($scope.formContainerOptions,schedulingMainHammockDataService);
			if ($scope.tools) {
				$scope.tools.update();
			}
		};

		schedulingMainService.registerCallBackOnChangeActivityType(updateStateOfToolBarButtons);

		$scope.$on('$destroy', function () {
			schedulingMainService.unRegisterCallBackOnChangeActivityType(updateStateOfToolBarButtons);
		});
	}

})(angular);