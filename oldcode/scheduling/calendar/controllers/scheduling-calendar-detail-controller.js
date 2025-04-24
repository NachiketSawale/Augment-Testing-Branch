(function (angular) {
	'use strict';
	var moduleName = 'scheduling.calendar';

	/**
	 * @ngdoc controller
	 * @name schedulingCalendarDetailController
	 * @function
	 *
	 * @description
	 * Controller for the  detail view of calendar entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('schedulingCalendarDetailController', SchedulingCalendarDetailController);

	SchedulingCalendarDetailController.$inject = ['$scope', 'platformModalService', 'platformContainerControllerService', 'schedulingCalendarMainService','schedulingCalendarValidationService'];

	function SchedulingCalendarDetailController($scope, platformModalService, platformContainerControllerService, schedulingCalendarMainService, schedulingCalendarValidationService) {
		platformContainerControllerService.initController($scope, moduleName, '506FC12756F8439E8FECB7EE4B360538', 'schedulingCalendarTranslationService');

		$scope.validateDefaults = function(entity, newVal){
			var res = schedulingCalendarValidationService.validateDefault(entity, newVal, 'IsDefault');
			if(res === false || res && !res.valid){
				var modalOptionDefault = {
					headerTextKey: 'scheduling.calendar.isDefaultInfoHeader',
					bodyTextKey: 'scheduling.calendar.isDefaultInfo',
					iconClass: 'ico-info'
				};
				// platformModalService.showDialog(modalOptionDefault);
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
})(angular);