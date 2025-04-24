/**
 * Created by janas on 11.05.2017.
 */

/*global angular */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCostgroupsImageProcessor
	 * @function
	 *
	 * @description
	 * The basicsCostgroupsImageProcessor adds appropriate images to cost groups.
	 */

	angular.module('basics.costgroups').factory('BasicsCostgroupsImageProcessor', [function () {

		return function (costGroupNo) {
			var self = this;
			self.costGroupNo = costGroupNo;

			self.processItem = function processItem(entity) {
				if (entity && (['1', '2', '3', '4', '5'].indexOf(self.costGroupNo) > -1)) {
					entity.image = 'ico-cost-group' + self.costGroupNo;
				}
			};
		};
	}]);
})(angular);