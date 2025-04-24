/**
 * Created by leo on 16.09.2014.
 */
(function () {

	'use strict';
	var moduleName = 'scheduling.calendar';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name schedulingCalendarWorkhourListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of workhour entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('schedulingCalendarWorkhourListController', SchedulingCalendarWorkhourListController);

	SchedulingCalendarWorkhourListController.$inject = ['$scope','$timeout', 'platformModalService','platformGridAPI','platformContainerControllerService', 'schedulingCalendarWorkhourValidationService'];
	function SchedulingCalendarWorkhourListController($scope, $timeout, platformModalService, platformGridAPI, platformContainerControllerService, schedulingCalendarWorkhourValidationService) {
		$scope.gridId = '7879E6D0D6BA45F3A6EF14D548EA77FC';
		platformContainerControllerService.initController($scope, moduleName, $scope.gridId);

		$scope.validateEndTime = function(entity, newVal){
			var valid = schedulingCalendarWorkhourValidationService.validateEndTime(entity, newVal);
			if(!valid){
				var modalOptions = {
					headerTextKey: 'scheduling.calendar.isDefaultInfoHeader',
					bodyTextKey: 'scheduling.calendar.isTimeValid',
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			}
			return valid;
		};
		$scope.validateStartTime = function(entity, newVal){
			var valid = schedulingCalendarWorkhourValidationService.validateStartTime(entity, newVal);
			if(!valid){
				var modalOptions = {
					headerTextKey: 'scheduling.calendar.isDefaultInfoHeader',
					bodyTextKey: 'scheduling.calendar.isTimeValid',
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			}
			return valid;
		};

		$scope.$watch('workHour',  function(){
			if($scope.workHour){
				$timeout(function () {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						// platformGridAPI.grids.invalidate($scope.gridId);
						platformGridAPI.grids.resize($scope.gridId);
					}
				});
				$scope.updateTools();
			}
		});
	}
})();