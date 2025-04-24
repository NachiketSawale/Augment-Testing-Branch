/**
 * Created by leo on 22.06.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectCostGroup1LookupDataService
	 * @function
	 *
	 * @description
	 * controllingGroupDetailLookupDataService is the data service for all project cost-group1 look ups
	 */
	angular.module('basics.lookupdata').factory('controllingGroupDetailLookupDataService', ['platformLookupDataServiceFactory', '$q',

		function (platformLookupDataServiceFactory, $q) {

			var controllingGroupDetailLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'controlling/structure/lookup/', endPointRead: 'controllinggroupdetail' },
				filterParam: 'controllinggroupFk',
				resolveStringValueCallback: (value) => {
					return $q.when({
						apply: true,
						valid: true,
						value: value
					});
				}
			};

			return platformLookupDataServiceFactory.createInstance(controllingGroupDetailLookupDataServiceConfig).service;
		}]);
})(angular);