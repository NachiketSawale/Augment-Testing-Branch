/**
 * Created by bh on 26.03.2019.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsCustomBoqItemStatusLookupDataService
	 * @function
	 *
	 * @description
	 * basicsCustomBoqItemStatusLookupDataService is the data service for all boq item status lookups
	 */
	angular.module('basics.lookupdata').factory('basicsCustomBoqItemStatusLookupDataService', ['basicsCustomStatusLookupDataFactoryService',
		function (basicsCustomStatusLookupDataFactoryService) {
			return basicsCustomStatusLookupDataFactoryService.createService('basicsCustomBoqItemStatusLookupDataService', 'boqitemstatus');
		}]);
})(angular);