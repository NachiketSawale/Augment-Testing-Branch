(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectProjectClerkLookupDataService
	 * @function
	 *
	 * @description
	 * projectProjectClerkLookupDataService is the data service for project look ups with filter clerk
	 */
	angular.module('basics.lookupdata').factory('projectProjectClerkLookupDataService', ['lookupFilterDialogDataService',

		function (filterLookupDataService) {

			let config = {};

			return filterLookupDataService.createInstance(config);
		}]);
})(angular);
