/**
 * Created by baf on 11.09.2014.
 */
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name schedulingMainActivityImageProcessor
	 * @function
	 *
	 * @description
	 * The schedulingMainActivityImageProcessor adds path to images for activities depending on there type.
	 */

	angular.module('scheduling.main').factory('schedulingMainActivityImageProcessor', [ '$injector', function ($injector) {

		var service = {};

		service.processItem = function processItem(activity) {
			if (!(activity && angular.isDefined(activity.ActivityTypeFk))) {
				return;
			}

			if(activity) {
				switch (activity.ActivityTypeFk) {
					case 1: // This is a Activity
						activity.image = 'ico-task';
						break;
					case 2: // This is a Summary Activity
						activity.image = 'ico-task-summary';
						break;
					case 3: // This is a Milestone
						activity.image = 'ico-milestone';
						break;
					case 4: // This is a Sub Schedule
						activity.image = 'ico-task-sub';
						break;
					case 5: // This is Schedule
						activity.image = 'ico-hammock';
						break;
					case $injector.get('schedulingMainConstantValues').activity.transientRootActivityTypeFk:
						activity.image = 'ico-root-scheduling';
						break;
					default:
						activity.image = 'ico-task';
						break;
				}
			}
		};

		return service;

	}]);
})(angular);
