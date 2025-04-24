(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name estimateBoqHeaderService
	 * @function
	 *
	 * @description
	 * estimateBoqHeaderService is the data service providing data for estimate headers for boq
	 */
	angular.module('basics.lookupdata').factory('estimateBoqHeaderService', [
		'platformLookupDataServiceFactory',
		function (platformLookupDataServiceFactory) {

			let readData = { ProjectId: null, BoqHeaderId: null, BoqItemId: null };

			var lookupServiceOption = {
				httpRead: {
					route: globals.webApiBaseUrl + 'estimate/main/header/',
					endPointRead: 'getfilteredlist'
				},
				filterParam: readData,
				prepareFilter: function prepareFilter(item) {
					readData = item;
					return readData;
				},
			};
			return platformLookupDataServiceFactory.createInstance(lookupServiceOption).service;
		}
	]);
})(angular);