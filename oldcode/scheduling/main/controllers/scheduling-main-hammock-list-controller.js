/**
 * Created by nitsche on 13.06.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainHammockListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of scheduling main hammock entities.
	 **/

	angular.module(moduleName).controller('schedulingMainHammockListController', SchedulingMainHammockListController);

	SchedulingMainHammockListController.$inject = ['$scope', 'platformContainerControllerService', 'schedulingMainService','platformContainerCreateDeleteButtonService','schedulingMainHammockDataService'];

	function SchedulingMainHammockListController($scope, platformContainerControllerService, schedulingMainService, platformContainerCreateDeleteButtonService, schedulingMainHammockDataService) {
		platformContainerControllerService.initController($scope, moduleName, '221f0cc18f014d608cfb9acef1de4bb5');

		var updateStateOfToolBarButtons = function updateStateOfToolBarButtons(){
			platformContainerCreateDeleteButtonService.toggleButtons($scope.containerButtonConfig,schedulingMainHammockDataService);
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