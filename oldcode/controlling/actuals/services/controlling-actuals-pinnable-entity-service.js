/**
 * Created by SSaluja.
 */
(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name controllingActualsPinnableEntityService
	 * @function
	 * @requires $http, cloudDesktopPinningContextService
	 *
	 * @description A pinning context service adapter for models.
	 */
	angular.module('controlling.actuals').factory('controllingActualsPinnableEntityService',
		['globals', '$http', 'cloudDesktopPinningContextService', '$injector', '$q',
			function (globals, $http, cloudDesktopPinningContextService, $injector, $q) {
				return cloudDesktopPinningContextService.createPinnableEntityService({
					token: 'controlling.actuals',
					retrieveInfo: function (id) {
						return $http.get(globals.webApiBaseUrl + 'controlling/actuals/costheader/listbyprojectfk?projectFk=' + id).then(function (response) {
							if (response && response.data) {
								return cloudDesktopPinningContextService.concate2StringsWithDelimiter(response.data[0].Code, response.data[0].Code, ' - ');
							}
							return $q.when('');
						});
					},
					dependsUpon: ['project.main']
				});
			}]);
})();
