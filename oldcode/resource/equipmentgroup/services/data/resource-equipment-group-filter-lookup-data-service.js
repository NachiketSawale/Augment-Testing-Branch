/**
 * Created by leo on 15.06.2021.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentGroupFilterLookupDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentGroupFilterLookupDataService is the data service for resource look ups
	 */
	angular.module('resource.equipmentgroup').factory('resourceEquipmentGroupFilterLookupDataService', ['lookupFilterDialogDataService',

		function (filterLookupDataService) {

			let options = {};

			return filterLookupDataService.createInstance(options);
		}]);
})(angular);