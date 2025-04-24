/**
 * Created by lja on 2015/12/23.
 */
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
	angular.module('basics.material').factory('basicsMaterialLookupExtendApiService',
		['basicsMaterialSearchServiceFactory', function (basicsMaterialSearchServiceFactory) {

			var service = basicsMaterialSearchServiceFactory.create();
			//add service extend here:

			var selectedMap = new Map();

			service.getSelectedItems = function () {
				return [...selectedMap.values()];
			};

			service.setSelected = function (item) {
				selectedMap.set(item.Id, item);
			};

			service.removeSelected = function (item) {
				selectedMap.delete(item.Id);
			};

			service.removeAll = function () {
				selectedMap.clear();
			};

			return service;
		}]);
})(angular);