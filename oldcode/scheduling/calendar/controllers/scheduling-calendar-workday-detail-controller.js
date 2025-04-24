/**
 * Created by leo on 19.01.2015.
 */
(function (angular) {

	'use strict';

	var moduleName = 'scheduling.calendar';

	/**
	 * @ngdoc controller
	 * @name schedulingCalendarWORkdayDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of weekday entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingCalendarWorkdayDetailController', ['$scope', 'schedulingCalendarWorkdayService', 'platformContainerControllerService', 'schedulingCalendarWorkdayValidationService', 'schedulingCalendarWorkdayConfigurationService', 'schedulingCalendarTranslationService', 'platformModalService',

		function ($scope, schedulingCalendarWorkdayService, platformContainerControllerService, schedulingCalendarWorkdayValidationService, schedulingCalendarWorkdayConfigurationService, schedulingCalendarTranslationService, platformModalService) {
			// platformDetailControllerService.initDetailController($scope, schedulingCalendarWorkdayService, schedulingCalendarWorkdayValidationService, schedulingCalendarWorkdayConfigurationService, schedulingCalendarTranslationService);
			platformContainerControllerService.initController($scope, moduleName, '55aa41e9e09fb8a27cd4a06d2693dc', 'schedulingCalendarTranslationService');
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
		}
	]);
})(angular);