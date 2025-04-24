(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basics.material.basicsMaterialSearchServiceFactory
	 * @function
	 * @requireds
	 *
	 * @description Provide CommoditySearch data
	 */
	angular.module('basics.material').factory('basicsMaterialLookupService',
		['basicsMaterialSearchServiceFactory', function (basicsMaterialSearchServiceFactory) {

			return basicsMaterialSearchServiceFactory.create();
		}]);
})(angular);