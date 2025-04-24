/**
 * Created by lnb on 4/13/2015.
 */
(function (angular) {
	'use strict';

	var moduleName = 'qto.main';
	/** qtoProjectLocationLookupDataServiceFactory
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 * extended from projectLocationLookupDataService, because default functionality in projectLocationLookupDataService is not support get data from cache.
	 */
	angular.module(moduleName).factory('qtoProjectLocationLookupDataService', ['qtoProjectLocationLookupDataServiceFactory','qtoBoqType',

		function (qtoProjectLocationLookupDataServiceFactory,qtoBoqType) {

			let service = qtoProjectLocationLookupDataServiceFactory.qtoProjectLocationLookupDataServiceFactory(qtoBoqType.QtoBoq);

			return service;

		}]);
})(angular);