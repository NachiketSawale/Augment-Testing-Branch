(function (angular) {
	'use strict';
	var moduleName = 'productionplanning.mounting';

	/**
	 * @ngdoc service
	 * @name ppsMountingConstantValues
	 * @function
	 *
	 * @description
	 * ppsMountingConstantValues provides definitions and constants frequently used in mounting module
	 */
	angular.module(moduleName).factory('ppsMountingConstantValues', function () {
		var self = this;
		self.mountingRubricId = 74;
		self.requsitionRubricCat = -1;
		return self;
	});
})(angular);