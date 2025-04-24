/**
 * Created by lnt on 05/06/2020.
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.package';
	/** procurementPackageQtoLocationLookupService
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 * extended from procurementPackageQtoLocationLookupService, because default functionality in projectLocationLookupDataService is not support get data from cache.
	 */
	angular.module(moduleName).factory('procurementPackageQtoLocationLookupService', ['qtoProjectLocationLookupDataServiceFactory', 'qtoBoqType',

		function (qtoProjectLocationLookupDataServiceFactory, qtoBoqType) {

			return qtoProjectLocationLookupDataServiceFactory.qtoProjectLocationLookupDataServiceFactory(qtoBoqType.PrcBoq);

		}]);
})(angular);