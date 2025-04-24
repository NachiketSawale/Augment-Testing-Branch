/**
 * Created by baf on 02.10.2014.
 */
(function (angular) {

	'use strict';
	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc controller
	 * @name schedulingMainListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of scheduling elements.
	 **/

	angular.module(moduleName).controller('schedulingMainProgressReportListController', SchedulingMainProgressReportListController);

	SchedulingMainProgressReportListController.$inject = ['$scope', 'platformContainerControllerService', 'platformContainerCreateDeleteButtonService', 'schedulingMainService', 'schedulingMainProgressReportService'];
	function SchedulingMainProgressReportListController($scope, platformContainerControllerService, platformContainerCreateDeleteButtonService, schedulingMainService, schedulingMainProgressReportService) {

		platformContainerControllerService.initController($scope, 'scheduling.main', '04CBFBACB07C4FBA922A9F2B91206657');

		var updateStateOfToolBarButtons = function updateStateOfToolBarButtons(){
			platformContainerCreateDeleteButtonService.toggleButtons($scope.containerButtonConfig,schedulingMainProgressReportService);
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