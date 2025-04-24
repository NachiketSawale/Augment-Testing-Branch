/**
 * Created by wed on 09/04/2019.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).factory('basicsCostGroupFilterCacheService', [
		'basicsCostGroupFilterCacheServiceFactory',
		'basicsCostGroupFilterCacheTypes',
		function (cacheServiceFactory,
		          cacheTypes) {

			return cacheServiceFactory.createService(cacheTypes);

		}]);

})(angular);