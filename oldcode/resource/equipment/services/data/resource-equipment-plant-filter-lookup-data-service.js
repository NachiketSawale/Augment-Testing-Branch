/**
 * Created by leo on 17.10.2017.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceMasterResourceFilterLookupDataService
	 * @function
	 *
	 * @description
	 * resourceEquipmentFilterLookupDataService is the data service for resource look ups
	 */
	angular.module('resource.equipment').factory('resourceEquipmentFilterLookupDataService', ['lookupFilterDialogDataService',

		function (filterLookupDataService) {

			var options = {
/*
				httpRoute: 'resource/equipment/plant/',
				endPointRead: 'lookuplistbyfilter',
				filterParam: {typeFk: null, kindFk: null}
*/
			};

			return filterLookupDataService.createInstance(options);
		}]);
})(angular);