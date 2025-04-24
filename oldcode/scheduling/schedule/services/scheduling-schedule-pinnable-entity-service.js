/**
 * Created by leo on 06.07.2017.
 */
(function () {
	'use strict';
	var moduleName = 'scheduling.schedule';
	/**
	 * @ngdoc service
	 * @name model.project.schedulingSchedulePinnableEntityService
	 * @function
	 * @requires $http, cloudDesktopPinningContextService
	 *
	 * @description A pinning context service adapter for models.
	 */
	angular.module(moduleName).factory('schedulingSchedulePinnableEntityService', ['$http',
		'cloudDesktopPinningContextService', 'schedulingSchedulePresentService',
		function ($http, cloudDesktopPinningContextService, schedulingSchedulePresentService) {
			return cloudDesktopPinningContextService.createPinnableEntityService({
				token: 'scheduling.main',
				retrieveInfo: function (id) {
					return schedulingSchedulePresentService.loadSchedule(id, true).then(function () {
						var selectedschedule = schedulingSchedulePresentService.getItemById(id);
						if (selectedschedule) {
							return cloudDesktopPinningContextService.concate2StringsWithDelimiter(selectedschedule.Code, selectedschedule.DescriptionInfo.Translated, ' - ');
						}
						return '';
					});

				},
				dependsUpon: ['project.main']
			});
		}]);
})();