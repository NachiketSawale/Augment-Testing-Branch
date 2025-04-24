/**
 * Created by lvy on 7/10/2018.
 */

(function () {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/**
	 * @ngdoc service
	 * @name packagePinnableEntityService
	 * @function
	 * @requires $http, cloudDesktopPinningContextService
	 *
	 * @description A pinning context service adapter for models.
	 */
	var moduleName = 'procurement.package';
	angular.module(moduleName).factory('packagePinnableEntityService', ['$http',
		'cloudDesktopPinningContextService', '$injector', '$q',
		function ($http, cloudDesktopPinningContextService, $injector, $q) {
			return cloudDesktopPinningContextService.createPinnableEntityService({
				token: 'procurement.package',
				retrieveInfo: function (id) {
					return $http.get(globals.webApiBaseUrl + 'procurement/package/package/getitembyid?headerId='+ id).then(function(response){
						if(response && response.data){
							return cloudDesktopPinningContextService.concate2StringsWithDelimiter(response.data.Code, response.data.Description, ' - ');
						}
						return $q.when('');
					});
				},
				dependsUpon: ['project.main']
			});
		}]);
})();