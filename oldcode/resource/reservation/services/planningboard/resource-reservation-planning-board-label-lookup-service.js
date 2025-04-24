/* global globals */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceReservationPlanningBoardLabelLookupService
	 * @function
	 *
	 * @description
	 * resourceReservationPlanningBoardLabelLookupService is the data service for planning board config in text groups lookup functionality.
	 */
	var moduleName = 'platform';
	angular.module(moduleName).factory('resourceReservationPlanningBoardLabelLookupService', ['$injector', '_', 'platformLookupDataServiceFactory',

		function ($injector, _, platformLookupDataServiceFactory) {
			let infoLabelLookupConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'resource/reservation/', endPointRead: 'lookupobjectpath', usePostForRead: true}
			};

			return platformLookupDataServiceFactory.createInstance(infoLabelLookupConfig).service;
		}]);
})(angular);