(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name ppsItemEventImageProcessor
	 * @function
	 *
	 * @description
	 * The ppsItemEventImageProcessor adds path to images for activities depending on there type.
	 */

	angular.module('productionplanning.item').factory('ppsItemEventImageProcessor', [ function () {

		var service = {};

		service.processItem = function processItem(item) {
			if (!(item && angular.isDefined(item.ActivityType))) {
				return;
			}

			if(item) {
				switch (item.ActivityType) {
					case 1: // This is a Activity
						item.image = 'ico-task';
						break;
					case 2: // This is a Summary Activity
						if (_.isNil(item.PrjLocationFk)){ // This is a Location
							item.image = 'ico-location';
						} else { // This is a Planning Unit
							item.image = 'ico-production-planning';
						}
						break;
					case 3: // This is a Milestone
						item.image = 'ico-milestone';
						break;
					case 4: // This is a Sub Schedule
						item.image = 'ico-task';
						break;
					case 5: // This is Schedule
						item.image = 'ico-hammock';
						break;
					default:
						item.image = 'ico-task';
						break;
				}
			}
		};

		return service;

	}]);
})(angular);