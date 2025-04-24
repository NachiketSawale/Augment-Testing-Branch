/**
 * Created by shen on 6/28/2022
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name resourceEquipmentComponentFilterLookupDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentGroupFilterLookupDataService is the data service for resource look ups
	 */
	angular.module('resource.equipment').factory('resourceEquipmentComponentFilterLookupDataService', ['lookupFilterDialogDataService',

		function (filterLookupDataService) {

			let options = {};

			return filterLookupDataService.createInstance(options);
		}]);
})(angular);