/**
 * Created by leo on 18.09.2014.
 */
(function () {

	'use strict';
	var moduleName = 'scheduling.calendar';
	var angModule = angular.module(moduleName);
	/**
	 * @ngdoc controller
	 * @name schedulingCalendarWorkdayListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of workday entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('schedulingCalendarWorkdayListController', SchedulingCalendarWorkdayListController);

	SchedulingCalendarWorkdayListController.$inject = ['$scope','$timeout', 'platformGridAPI', 'platformModalService', 'platformContainerControllerService', 'schedulingCalendarWorkdayValidationService'];
	function SchedulingCalendarWorkdayListController($scope, $timeout, platformGridAPI, platformModalService, platformContainerControllerService , schedulingCalendarWorkdayValidationService) {

		$scope.gridId = 'F043FAF3C3C6493181364128E3D0CD1E';
		platformContainerControllerService.initController($scope, moduleName, $scope.gridId);

		$scope.validateEndTime = function(entity, newVal){
			var valid = schedulingCalendarWorkdayValidationService.validateEndTime(entity, newVal);
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
			var valid =  schedulingCalendarWorkdayValidationService.validateStartTime(entity, newVal);
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

		$scope.validateExceptDate = function(entity, newVal){
			var valid =  schedulingCalendarWorkdayValidationService.validateExceptDate(entity, newVal);
			if(!valid){
				var modalOptions = {
					headerTextKey: 'scheduling.calendar.isDefaultInfoHeader',
					bodyTextKey: 'scheduling.calendar.isExceptDateUnique',
					iconClass: 'ico-info'
				};
				platformModalService.showDialog(modalOptions);
			}
			return valid;
		};

		$scope.$watch('workDay',  function(){
			if($scope.workDay){
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