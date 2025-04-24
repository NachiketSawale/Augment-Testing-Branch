/**
 * Created by Joshi on 09.08.2017.
 */
(function () {
	'use strict';
	/* global globals */
	/**
	 * @ngdoc service
	 * @name estimateMainPinnableEntityService
	 * @function
	 * @requires $http, cloudDesktopPinningContextService
	 *
	 * @description A pinning context service adapter for models.
	 */
	angular.module('estimate.main').factory('estimateMainPinnableEntityService', ['$http',
		'cloudDesktopPinningContextService', '$injector', '$q',
		function ($http, cloudDesktopPinningContextService, $injector, $q) {
			return cloudDesktopPinningContextService.createPinnableEntityService({
				token: 'estimate.main',
				retrieveInfo: function (id) {
					return $http.get(globals.webApiBaseUrl + 'estimate/main/header/getitembyid?headerId='+ id).then(function(response){
						if(response && response.data){
							return cloudDesktopPinningContextService.concate2StringsWithDelimiter(response.data.Code, response.data.DescriptionInfo.Translated, ' - ');
						}
						return $q.when('');
					});
				},
				dependsUpon: ['project.main']
			});
		}]);
})();