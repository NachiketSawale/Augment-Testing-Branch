(function (angular) {
	'use strict';
	var moduleName = 'scheduling.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingMainProgressReportDetailController', SchedulingMainProgressReportDetailController);

	SchedulingMainProgressReportDetailController.$inject = ['$scope', 'platformContainerControllerService', 'platformContainerCreateDeleteButtonService', 'schedulingMainService', 'schedulingMainProgressReportService'];

	function SchedulingMainProgressReportDetailController($scope, platformContainerControllerService, platformContainerCreateDeleteButtonService, schedulingMainService, schedulingMainProgressReportService) {
		platformContainerControllerService.initController($scope, moduleName, '27C823EF3D0A4FE3B38D43957B5C86D6', 'schedulingMainTranslationService');
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