/**
 * Created by leo on 11.01.2021.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectMainActionLookupDataService
	 * @function
	 *
	 * @description
	 * projectMainActionLookupDataService
	 */
	angular.module('project.main').factory('projectMainActionLookupDataService', ['lookupFilterDialogDataService',

		function (filterLookupDataService) {

			var actionLookupDataServiceConfig = {};

			return filterLookupDataService.createInstance(actionLookupDataServiceConfig);
		}]);
})(angular);
