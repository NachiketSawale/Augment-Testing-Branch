/**
 * Created by baf on 04.09.2014.
 */
(function (angular) {
	'use strict';
	var moduleName = 'scheduling.main';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingMainRelationshipDetailController', SchedulingMainRelationshipDetailController);

	SchedulingMainRelationshipDetailController.$inject = ['$scope', 'platformContainerControllerService', 'platformContainerCreateDeleteButtonService', 'schedulingMainService', 'schedulingMainSuccessorRelationshipDataService'];

	function SchedulingMainRelationshipDetailController($scope, platformContainerControllerService, platformContainerCreateDeleteButtonService, schedulingMainService, schedulingMainSuccessorRelationshipDataService) {
		var updateStateOfToolBarButtons = function updateStateOfToolBarButtons(){
			platformContainerCreateDeleteButtonService.toggleButtons($scope.containerButtonConfig, schedulingMainSuccessorRelationshipDataService);
			if ($scope.tools) {
				$scope.tools.update();
			}
		};
		platformContainerControllerService.initController($scope, moduleName, '800651ED2F844B2592E39BEA7DF6AB69', 'schedulingMainTranslationService');

		schedulingMainService.registerCallBackOnChangeActivityType(updateStateOfToolBarButtons);

		$scope.$on('$destroy', function () {
			schedulingMainService.unRegisterCallBackOnChangeActivityType(updateStateOfToolBarButtons);
		});
	}

})(angular);