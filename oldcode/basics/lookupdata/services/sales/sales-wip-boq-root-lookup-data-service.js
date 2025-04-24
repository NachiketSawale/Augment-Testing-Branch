(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name salesWipBoqRootLookupDataService
	 * @function
	 *
	 * @description
	 * salesWipBoqRootLookupDataService is the data service for wip boq root
	 */
	angular.module('basics.lookupdata').factory('salesWipBoqRootLookupDataService', ['$http',

		function ($http ) {

			// Object presenting the service
			var service = {};

			//get list of the estimate boq item by Id
			service.getItemById = function getItemById() {
				return null;
			};

			//get list of the estimate boq item by Id Async
			service.getItemByIdAsync = function getItemByIdAsync(value) {
				return $http.get(	globals.webApiBaseUrl + 'boq/main/getboqrootitembyheaderid?headerId='+value).then(function(response){
					return response.data;
				});
			};

			return service;
		}]);
})(angular);
