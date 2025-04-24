/**
 * Created by lnt on 05/06/2020.
 */
(function (angular) {
	'use strict';

	var moduleName = 'boq.main';
	/** boqMainQtoLocationLookupService
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 * extended from boqMainQtoLocationLookupService, because default functionality in projectLocationLookupDataService is not support get data from cache.
	 */
	angular.module(moduleName).factory('boqMainQtoLocationLookupService', ['qtoProjectLocationLookupDataServiceFactory', 'qtoBoqType',

		function (qtoProjectLocationLookupDataServiceFactory, qtoBoqType) {

			var service = qtoProjectLocationLookupDataServiceFactory.qtoProjectLocationLookupDataServiceFactory(qtoBoqType.PrjBoq);

			return service;

		}]);
})(angular);