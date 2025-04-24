/**
 * Created by leo on 16.09.2014.
 */
(function () {

	'use strict';
	var moduleName = 'scheduling.calendar';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name schedulingCalendarListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of calendar entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angModule.controller('schedulingCalendarListController', SchedulingCalendarListController);

	SchedulingCalendarListController.$inject = ['$scope','platformModalService','platformContainerControllerService','schedulingCalendarValidationService','schedulingCalendarMainService'];
	function SchedulingCalendarListController($scope, platformModalService, platformContainerControllerService, schedulingCalendarValidationService, schedulingCalendarMainService) {
		platformContainerControllerService.initController($scope, moduleName, 'AFECDB4A08404395855258B70652D04B');

		$scope.validateDefaults = function(entity, newVal){
			var res = schedulingCalendarValidationService.validateDefault(entity, newVal, 'IsDefault');
			if(res === false || res && !res.valid){
				var modalOptionDefault = {
					headerTextKey: 'scheduling.calendar.isDefaultInfoHeader',
					bodyTextKey: 'scheduling.calendar.isDefaultInfo',
					showCancelButton: true,
					showYesButton: true,
					showNoButton: true,
					iconClass: 'ico-question'
				};
				platformModalService.showDialog(modalOptionDefault).then(function (result) {
					var items = schedulingCalendarMainService.getList();
					if(result.yes) {
						angular.forEach(items, function (calendar) {
							if (calendar.IsDefault && calendar.Id !== entity.Id) {
								calendar.IsDefault = false;
								schedulingCalendarMainService.save(calendar);
							}
						});
					} else {
						entity.IsDefault = false;
						schedulingCalendarMainService.fireItemModified(entity);
					}
				});
			}
			return true;
		};
	}
})();